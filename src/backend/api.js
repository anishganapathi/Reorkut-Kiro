import { supabase } from './client'

// --- Constants ---
export const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'

// --- Auth ---
export const signUp = async ({ email, password, name, birthDate, gender, country, city }) => {
    console.log('SignUp called with:', { email, name, birthDate, gender, country, city })

    // Step 1: Create the auth user (trigger will auto-create basic profile)
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { name }
        }
    })

    if (error) {
        console.error('Auth signup error:', error)
        throw error
    }

    console.log('Auth signup successful, user created:', data.user?.id)
    console.log('Database trigger should have created basic profile')

    // Step 2: Wait a moment for trigger to complete
    await new Promise(resolve => setTimeout(resolve, 500))

    // Step 3: Update the profile with registration data
    if (data.user) {
        const profileUpdates = {
            birth_date: birthDate,
            gender,
            country,
            city
        }

        console.log('Updating profile with registration data:', profileUpdates)

        try {
            const { data: profileResult, error: profileError } = await supabase
                .from('profiles')
                .update(profileUpdates)
                .eq('id', data.user.id)
                .select()

            if (profileError) {
                console.error('Error updating profile:', profileError)
                console.error('Profile error details:', JSON.stringify(profileError, null, 2))
                // Don't throw - user can update their profile later
            } else {
                console.log('Profile updated successfully:', profileResult)
            }
        } catch (updateError) {
            console.error('Exception updating profile:', updateError)
            // Don't throw - user can update their profile later
        }
    }

    return data
}

export const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
    if (error) throw error
    return data
}

export const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}

export const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // Fetch detailed profile
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) {
        console.warn('Profile fetch error, attempting to create default profile:', error)

        // Attempt to create a default profile
        const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{
                id: user.id,
                email: user.email,
                name: user.user_metadata?.name || user.email?.split('@')[0] || 'New User',
                image: `https://www.gravatar.com/avatar/${user.id}?d=mp&f=y`,
                // Add other default fields if necessary, e.g.
                country: 'Unknown',
                city: 'Unknown'
            }])
            .select()
            .single()

        if (createError) {
            console.error('Failed to auto-create profile:', createError)
            return user // Return basic user if profile creation also fails
        }

        return { ...user, ...newProfile }
    }
    return { ...user, ...profile }
}

// --- Users / Profiles ---
export const fetchUser = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()

        if (error) {
            console.warn('Error fetching user profile:', error)
            return null
        }
        return data
    } catch (err) {
        console.error('Unexpected error fetching user:', err)
        return null
    }
}

export const uploadProfileImage = async (file, userId) => {
    try {
        console.log('Starting image upload for user:', userId)
        console.log('File details:', { name: file.name, size: file.size, type: file.type })

        const fileExt = file.name.split('.').pop()
        const timestamp = Date.now()
        const fileName = `${userId}-${timestamp}.${fileExt}`

        console.log('Uploading to path:', fileName)

        // Upload the file
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: true
            })

        if (uploadError) {
            console.error('Upload error:', uploadError)
            throw uploadError
        }

        console.log('Upload successful:', uploadData)

        // Get the public URL
        const { data: urlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName)

        console.log('Public URL:', urlData.publicUrl)
        return urlData.publicUrl
    } catch (error) {
        console.error('Error in uploadProfileImage:', error)
        throw error
    }
}

export const updateUser = async (userId, updates) => {
    // Filter out undefined, null, and empty values to prevent schema issues
    const cleanedUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
        // Only include fields that have actual values
        if (value !== undefined && value !== null && value !== '') {
            acc[key] = value
        }
        return acc
    }, {})

    console.log('Cleaned updates being sent to Supabase:', cleanedUpdates)

    const { data, error } = await supabase
        .from('profiles')
        .update(cleanedUpdates)
        .eq('id', userId)
        .select()

    if (error) {
        console.error('Supabase update error:', error)
        throw error
    }

    return data[0]
}

// --- Scraps ---
export const fetchScraps = async (userId) => {
    const { data, error } = await supabase
        .from('scraps')
        .select(`
            *,
            sender:sender_id (name, image)
        `)
        .eq('receiver_id', userId)
        .order('created_at', { ascending: false })
    if (error) throw error
    return data
}

export const postScrap = async ({ senderId, receiverId, content }) => {
    const { data, error } = await supabase
        .from('scraps')
        .insert([{
            sender_id: senderId,
            receiver_id: receiverId,
            content
        }])
        .select(`
            *,
            sender:sender_id (name, image)
        `)
        .single()
    if (error) throw error
    return data
}

export const deleteScrap = async (scrapId) => {
    const { error } = await supabase
        .from('scraps')
        .delete()
        .eq('id', scrapId)
    if (error) throw error
}

export const replyToScrap = async ({ scrapId, senderId, receiverId, content }) => {
    const { data, error } = await supabase
        .from('scraps')
        .insert([{
            sender_id: senderId,
            receiver_id: receiverId,
            content,
            parent_scrap_id: scrapId
        }])
        .select(`
            *,
            sender:sender_id (name, image)
        `)
        .single()
    if (error) throw error
    return data
}

// --- Messages ---
export const fetchMessages = async (userId) => {
    const { data, error } = await supabase
        .from('messages')
        .select(`
            *,
            sender:sender_id (name, image),
            receiver:receiver_id (name, image)
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false })
    if (error) throw error
    return data
}

export const sendMessage = async ({ senderId, receiverId, subject, content }) => {
    const { data, error } = await supabase
        .from('messages')
        .insert([{
            sender_id: senderId,
            receiver_id: receiverId,
            subject,
            content,
            is_read: false
        }])
        .select()
        .single()
    if (error) throw error
    return data
}

export const markMessageAsRead = async (messageId) => {
    const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId)
    if (error) throw error
}

export const deleteMessage = async (messageId) => {
    const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
    if (error) throw error
}

// --- Friend Requests ---
export const sendFriendRequest = async (senderId, receiverId) => {
    const { data, error } = await supabase
        .from('friend_requests')
        .insert([{
            sender_id: senderId,
            receiver_id: receiverId,
            status: 'pending'
        }])
        .select()
        .single()
    if (error) throw error
    return data
}

export const acceptFriendRequest = async (requestId) => {
    const { data: request, error: fetchError } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('id', requestId)
        .single()

    if (fetchError) throw fetchError

    // Update request status
    const { error: updateError } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId)

    if (updateError) throw updateError

    // Create friendship entries
    const { error: friendshipError } = await supabase
        .from('friendships')
        .insert([
            { user_id: request.sender_id, friend_id: request.receiver_id },
            { user_id: request.receiver_id, friend_id: request.sender_id }
        ])

    if (friendshipError) throw friendshipError
}

export const rejectFriendRequest = async (requestId) => {
    const { error } = await supabase
        .from('friend_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId)
    if (error) throw error
}

export const fetchFriendRequests = async (userId) => {
    const { data, error } = await supabase
        .from('friend_requests')
        .select(`
            *,
            sender:sender_id (name, image, city, country)
        `)
        .eq('receiver_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
    if (error) throw error
    return data
}

// --- Friends ---
export const fetchFriends = async (userId) => {
    const { data, error } = await supabase
        .from('friendships')
        .select(`
            friend:friend_id (id, name, image, city, country, relationship_status)
        `)
        .eq('user_id', userId)
    if (error) throw error
    return data.map(f => f.friend)
}

export const removeFriend = async (userId, friendId) => {
    const { error } = await supabase
        .from('friendships')
        .delete()
        .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`)
    if (error) throw error
}

// --- Testimonials ---
export const fetchTestimonials = async (userId) => {
    const { data, error } = await supabase
        .from('testimonials')
        .select(`
            *,
            author:author_id (name, image, city, country)
        `)
        .eq('user_id', userId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
    if (error) throw error
    return data
}

export const fetchPendingTestimonials = async (userId) => {
    const { data, error } = await supabase
        .from('testimonials')
        .select(`
            *,
            author:author_id (name, image, city, country)
        `)
        .eq('user_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
    if (error) throw error
    return data
}

export const writeTestimonial = async ({ authorId, userId, content }) => {
    const { data, error } = await supabase
        .from('testimonials')
        .insert([{
            author_id: authorId,
            user_id: userId,
            content,
            status: 'pending'
        }])
        .select()
        .single()
    if (error) throw error
    return data
}

export const approveTestimonial = async (testimonialId) => {
    const { error } = await supabase
        .from('testimonials')
        .update({ status: 'approved' })
        .eq('id', testimonialId)
    if (error) throw error
}

export const rejectTestimonial = async (testimonialId) => {
    const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', testimonialId)
    if (error) throw error
}

// --- Videos ---
export const fetchVideos = async (userId) => {
    const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    if (error) throw error
    return data
}

export const uploadVideo = async ({ userId, title, url, thumbnail }) => {
    try {
        const { data, error } = await supabase
            .from('videos')
            .insert([{
                user_id: userId,
                title,
                url,
                thumbnail
            }])
            .select()
            .single()

        if (error) {
            // Check if error is due to missing thumbnail column (PGRST204 or similar schema error)
            if (error.message && error.message.includes('thumbnail')) {
                console.warn('Thumbnail column missing in database. Uploading video without thumbnail.')

                // Retry without thumbnail
                const { data: retryData, error: retryError } = await supabase
                    .from('videos')
                    .insert([{
                        user_id: userId,
                        title,
                        url
                    }])
                    .select()
                    .single()

                if (retryError) throw retryError
                return retryData
            }
            throw error
        }
        return data
    } catch (err) {
        throw err
    }
}

export const deleteVideo = async (videoId) => {
    const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId)
    if (error) throw error
}

// --- Communities ---
export const fetchCommunities = async () => {
    const { data, error } = await supabase
        .from('communities')
        .select('*')
    if (error) throw error
    return data
}

export const fetchUserCommunities = async (userId) => {
    const { data, error } = await supabase
        .from('community_members')
        .select(`
            community:community_id (*)
        `)
        .eq('user_id', userId)
    if (error) throw error
    return data.map(c => c.community)
}

export const createCommunity = async (communityData) => {
    const { data, error } = await supabase
        .from('communities')
        .insert([communityData])
        .select()
        .single()
    if (error) throw error
    return data
}

export const joinCommunity = async (userId, communityId) => {
    const { error } = await supabase
        .from('community_members')
        .insert([{
            user_id: userId,
            community_id: communityId
        }])
    if (error) throw error
}

export const leaveCommunity = async (userId, communityId) => {
    const { error } = await supabase
        .from('community_members')
        .delete()
        .eq('user_id', userId)
        .eq('community_id', communityId)
    if (error) throw error
}

// --- Profile Visitors ---
export const trackProfileVisit = async (visitorId, profileId) => {
    if (visitorId === profileId) return // Don't track self-visits

    const { error } = await supabase
        .from('profile_visits')
        .insert([{
            visitor_id: visitorId,
            profile_id: profileId
        }])
    if (error) console.error('Error tracking visit:', error)
}

export const fetchProfileVisitors = async (profileId, limit = 10) => {
    const { data, error } = await supabase
        .from('profile_visits')
        .select(`
            *,
            visitor:visitor_id (name, image, city, country)
        `)
        .eq('profile_id', profileId)
        .order('visited_at', { ascending: false })
        .limit(limit)
    if (error) throw error
    return data
}

// --- Search ---
export const searchUsers = async (query) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, name, image, city, country')
        .ilike('name', `%${query}%`)
        .limit(20)
    if (error) throw error
    return data
}

export const searchCommunities = async (query) => {
    const { data, error } = await supabase
        .from('communities')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(20)
    if (error) throw error
    return data
}

// --- Photo Albums ---
export const fetchPhotoAlbums = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('photo_albums')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) throw error

        // Get photo counts for each album
        const albumsWithCounts = await Promise.all(
            data.map(async (album) => {
                const { count, error: countError } = await supabase
                    .from('photos')
                    .select('*', { count: 'exact', head: true })
                    .eq('album_id', album.id)

                if (countError) {
                    console.error('Error counting photos:', countError)
                    return { ...album, photo_count: 0, cover_image: null }
                }

                // Get the first photo as cover image
                const { data: photos, error: photoError } = await supabase
                    .from('photos')
                    .select('url')
                    .eq('album_id', album.id)
                    .order('created_at', { ascending: false })
                    .limit(1)

                const coverImage = photos && photos.length > 0 ? photos[0].url : null

                return {
                    ...album,
                    photo_count: count || 0,
                    cover_image: coverImage
                }
            })
        )

        return albumsWithCounts
    } catch (error) {
        console.error('Error fetching photo albums:', error)
        throw error
    }
}

export const createPhotoAlbum = async ({ userId, name, description }) => {
    try {
        const { data, error } = await supabase
            .from('photo_albums')
            .insert([{
                user_id: userId,
                name,
                description
            }])
            .select()
            .single()

        if (error) throw error
        return { ...data, photo_count: 0, cover_image: null }
    } catch (error) {
        console.error('Error creating photo album:', error)
        throw error
    }
}

export const deletePhotoAlbum = async (albumId) => {
    try {
        // First, get all photos in the album to delete from storage
        const { data: photos, error: fetchError } = await supabase
            .from('photos')
            .select('url')
            .eq('album_id', albumId)

        if (fetchError) throw fetchError

        // Delete photos from storage
        if (photos && photos.length > 0) {
            for (const photo of photos) {
                const fileName = photo.url.split('/').pop()
                const { error: storageError } = await supabase.storage
                    .from('photos')
                    .remove([fileName])

                if (storageError) {
                    console.error('Error deleting photo from storage:', storageError)
                }
            }
        }

        // Delete the album (cascade will delete photo records)
        const { error } = await supabase
            .from('photo_albums')
            .delete()
            .eq('id', albumId)

        if (error) throw error
    } catch (error) {
        console.error('Error deleting photo album:', error)
        throw error
    }
}

// --- Photos ---
export const fetchAlbumPhotos = async (albumId) => {
    try {
        const { data, error } = await supabase
            .from('photos')
            .select('*')
            .eq('album_id', albumId)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error fetching album photos:', error)
        throw error
    }
}

export const uploadPhotos = async ({ albumId, userId, files }) => {
    try {
        const uploadedPhotos = []

        for (const file of files) {
            // Upload to storage
            const fileExt = file.name.split('.').pop()
            const timestamp = Date.now()
            const random = Math.random().toString(36).substring(7)
            const fileName = `${userId}/${albumId}/${timestamp}-${random}.${fileExt}`

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('photos')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) {
                console.error('Error uploading photo:', uploadError)
                continue
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('photos')
                .getPublicUrl(fileName)

            // Create database record
            const { data: photoData, error: dbError } = await supabase
                .from('photos')
                .insert([{
                    album_id: albumId,
                    user_id: userId,
                    url: urlData.publicUrl
                }])
                .select()
                .single()

            if (dbError) {
                console.error('Error creating photo record:', dbError)
                continue
            }

            uploadedPhotos.push(photoData)
        }

        return uploadedPhotos
    } catch (error) {
        console.error('Error uploading photos:', error)
        throw error
    }
}

export const deletePhoto = async (photoId) => {
    try {
        // Get photo URL first
        const { data: photo, error: fetchError } = await supabase
            .from('photos')
            .select('url')
            .eq('id', photoId)
            .single()

        if (fetchError) throw fetchError

        // Delete from storage
        const fileName = photo.url.split('/photos/')[1]
        if (fileName) {
            const { error: storageError } = await supabase.storage
                .from('photos')
                .remove([fileName])

            if (storageError) {
                console.error('Error deleting photo from storage:', storageError)
            }
        }

        // Delete from database
        const { error } = await supabase
            .from('photos')
            .delete()
            .eq('id', photoId)

        if (error) throw error
    } catch (error) {
        console.error('Error deleting photo:', error)
        throw error
    }
}
