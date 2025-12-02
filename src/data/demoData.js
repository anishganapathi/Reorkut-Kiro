// Centralized demo data configuration for the Orkut clone

export const demoUsers = [
    {
        id: 'demo-user-1',
        name: 'Maria Silva',
        image: 'https://i.pravatar.cc/150?img=1',
        city: 'São Paulo',
        country: 'Brazil',
        status: 'online'
    },
    {
        id: 'demo-user-2',
        name: 'João Santos',
        image: 'https://i.pravatar.cc/150?img=12',
        city: 'Rio de Janeiro',
        country: 'Brazil',
        status: 'away'
    },
    {
        id: 'demo-user-3',
        name: 'Ana Costa',
        image: 'https://i.pravatar.cc/150?img=5',
        city: 'Mumbai',
        country: 'India',
        status: 'online'
    },
    {
        id: 'demo-user-4',
        name: 'Carlos Mendes',
        image: 'https://i.pravatar.cc/150?img=13',
        city: 'Lisbon',
        country: 'Portugal',
        status: 'busy'
    },
    {
        id: 'demo-user-5',
        name: 'Priya Sharma',
        image: 'https://i.pravatar.cc/150?img=9',
        city: 'Delhi',
        country: 'India',
        status: 'online'
    }
]

export const demoAlbums = [
    {
        id: 'demo-album-1',
        name: 'Summer Vacation 2006',
        description: 'Beach trip with friends',
        coverImage: 'https://picsum.photos/seed/album1/400/300',
        photoCount: 6,
        userId: 'demo-user-1',
        isDemo: true
    },
    {
        id: 'demo-album-2',
        name: 'Birthday Party',
        description: 'My 18th birthday celebration',
        coverImage: 'https://picsum.photos/seed/album2/400/300',
        photoCount: 8,
        userId: 'demo-user-2',
        isDemo: true
    },
    {
        id: 'demo-album-3',
        name: 'College Days',
        description: 'Memories from university',
        coverImage: 'https://picsum.photos/seed/album3/400/300',
        photoCount: 6,
        userId: 'demo-user-3',
        isDemo: true
    }
]

export const demoPhotos = [
    // Summer Vacation 2006
    {
        id: 'demo-photo-1',
        albumId: 'demo-album-1',
        url: 'https://picsum.photos/seed/photo1/800/600',
        caption: 'Beautiful sunset at the beach',
        date: '2006-07-15',
        isDemo: true
    },
    {
        id: 'demo-photo-2',
        albumId: 'demo-album-1',
        url: 'https://picsum.photos/seed/photo2/800/600',
        caption: 'Swimming with friends',
        date: '2006-07-16',
        isDemo: true
    },
    {
        id: 'demo-photo-3',
        albumId: 'demo-album-1',
        url: 'https://picsum.photos/seed/photo3/800/600',
        caption: 'Beach volleyball',
        date: '2006-07-17',
        isDemo: true
    },
    {
        id: 'demo-photo-4',
        albumId: 'demo-album-1',
        url: 'https://picsum.photos/seed/photo4/800/600',
        caption: 'Bonfire night',
        date: '2006-07-18',
        isDemo: true
    },
    {
        id: 'demo-photo-5',
        albumId: 'demo-album-1',
        url: 'https://picsum.photos/seed/photo5/800/600',
        caption: 'Group photo',
        date: '2006-07-19',
        isDemo: true
    },
    {
        id: 'demo-photo-6',
        albumId: 'demo-album-1',
        url: 'https://picsum.photos/seed/photo6/800/600',
        caption: 'Last day at the beach',
        date: '2006-07-20',
        isDemo: true
    },
    // Birthday Party
    {
        id: 'demo-photo-7',
        albumId: 'demo-album-2',
        url: 'https://picsum.photos/seed/photo7/800/600',
        caption: 'Blowing out the candles',
        date: '2006-03-10',
        isDemo: true
    },
    {
        id: 'demo-photo-8',
        albumId: 'demo-album-2',
        url: 'https://picsum.photos/seed/photo8/800/600',
        caption: 'With my best friends',
        date: '2006-03-10',
        isDemo: true
    },
    {
        id: 'demo-photo-9',
        albumId: 'demo-album-2',
        url: 'https://picsum.photos/seed/photo9/800/600',
        caption: 'Opening presents',
        date: '2006-03-10',
        isDemo: true
    },
    {
        id: 'demo-photo-10',
        albumId: 'demo-album-2',
        url: 'https://picsum.photos/seed/photo10/800/600',
        caption: 'Dancing',
        date: '2006-03-10',
        isDemo: true
    },
    {
        id: 'demo-photo-11',
        albumId: 'demo-album-2',
        url: 'https://picsum.photos/seed/photo11/800/600',
        caption: 'Family photo',
        date: '2006-03-10',
        isDemo: true
    },
    {
        id: 'demo-photo-12',
        albumId: 'demo-album-2',
        url: 'https://picsum.photos/seed/photo12/800/600',
        caption: 'The birthday cake',
        date: '2006-03-10',
        isDemo: true
    },
    {
        id: 'demo-photo-13',
        albumId: 'demo-album-2',
        url: 'https://picsum.photos/seed/photo13/800/600',
        caption: 'Party decorations',
        date: '2006-03-10',
        isDemo: true
    },
    {
        id: 'demo-photo-14',
        albumId: 'demo-album-2',
        url: 'https://picsum.photos/seed/photo14/800/600',
        caption: 'End of the night',
        date: '2006-03-10',
        isDemo: true
    },
    // College Days
    {
        id: 'demo-photo-15',
        albumId: 'demo-album-3',
        url: 'https://picsum.photos/seed/photo15/800/600',
        caption: 'First day of college',
        date: '2005-08-20',
        isDemo: true
    },
    {
        id: 'demo-photo-16',
        albumId: 'demo-album-3',
        url: 'https://picsum.photos/seed/photo16/800/600',
        caption: 'Study group',
        date: '2005-09-15',
        isDemo: true
    },
    {
        id: 'demo-photo-17',
        albumId: 'demo-album-3',
        url: 'https://picsum.photos/seed/photo17/800/600',
        caption: 'Campus life',
        date: '2005-10-10',
        isDemo: true
    },
    {
        id: 'demo-photo-18',
        albumId: 'demo-album-3',
        url: 'https://picsum.photos/seed/photo18/800/600',
        caption: 'Library sessions',
        date: '2005-11-05',
        isDemo: true
    },
    {
        id: 'demo-photo-19',
        albumId: 'demo-album-3',
        url: 'https://picsum.photos/seed/photo19/800/600',
        caption: 'Graduation day',
        date: '2006-05-20',
        isDemo: true
    },
    {
        id: 'demo-photo-20',
        albumId: 'demo-album-3',
        url: 'https://picsum.photos/seed/photo20/800/600',
        caption: 'With professors',
        date: '2006-05-20',
        isDemo: true
    }
]

export const demoVideos = [
    {
        id: 'demo-video-1',
        title: 'My First Video',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        views: 42,
        userId: 'demo-user-1',
        isDemo: true
    },
    {
        id: 'demo-video-2',
        title: 'Beach Trip Highlights',
        url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
        thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg',
        views: 128,
        userId: 'demo-user-2',
        isDemo: true
    },
    {
        id: 'demo-video-3',
        title: 'Birthday Celebration',
        url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
        thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg',
        views: 87,
        userId: 'demo-user-3',
        isDemo: true
    },
    {
        id: 'demo-video-4',
        title: 'College Memories',
        url: 'https://www.youtube.com/watch?v=L_jWHffIx5E',
        thumbnail: 'https://img.youtube.com/vi/L_jWHffIx5E/hqdefault.jpg',
        views: 203,
        userId: 'demo-user-4',
        isDemo: true
    },
    {
        id: 'demo-video-5',
        title: 'Weekend Adventures',
        url: 'https://www.youtube.com/watch?v=ZZ5LpwO-An4',
        thumbnail: 'https://img.youtube.com/vi/ZZ5LpwO-An4/hqdefault.jpg',
        views: 156,
        userId: 'demo-user-5',
        isDemo: true
    }
]

export const demoPosts = [
    {
        id: 'demo-post-1',
        userId: 'demo-user-1',
        userName: 'Maria Silva',
        userImage: 'https://i.pravatar.cc/150?img=1',
        content: 'Just joined Orkut! So excited to connect with friends!',
        type: 'text',
        likes: 15,
        comments: [
            {
                id: 'demo-comment-1',
                userId: 'demo-user-2',
                userName: 'João Santos',
                userImage: 'https://i.pravatar.cc/150?img=12',
                content: 'Welcome!',
                timestamp: '2006-01-15T10:30:00Z'
            },
            {
                id: 'demo-comment-2',
                userId: 'demo-user-3',
                userName: 'Ana Costa',
                userImage: 'https://i.pravatar.cc/150?img=5',
                content: 'Great to have you here!',
                timestamp: '2006-01-15T11:00:00Z'
            }
        ],
        timestamp: '2006-01-15T10:00:00Z',
        isDemo: true
    },
    {
        id: 'demo-post-2',
        userId: 'demo-user-2',
        userName: 'João Santos',
        userImage: 'https://i.pravatar.cc/150?img=12',
        content: 'Check out my new photos from the beach!',
        type: 'text',
        likes: 23,
        comments: [
            {
                id: 'demo-comment-3',
                userId: 'demo-user-1',
                userName: 'Maria Silva',
                userImage: 'https://i.pravatar.cc/150?img=1',
                content: 'Amazing photos!',
                timestamp: '2006-02-10T14:20:00Z'
            }
        ],
        timestamp: '2006-02-10T14:00:00Z',
        isDemo: true
    },
    {
        id: 'demo-post-3',
        userId: 'demo-user-3',
        userName: 'Ana Costa',
        userImage: 'https://i.pravatar.cc/150?img=5',
        content: 'Happy birthday to me! 🎉',
        type: 'text',
        likes: 45,
        comments: [
            {
                id: 'demo-comment-4',
                userId: 'demo-user-4',
                userName: 'Carlos Mendes',
                userImage: 'https://i.pravatar.cc/150?img=13',
                content: 'Happy birthday! 🎂',
                timestamp: '2006-03-10T09:15:00Z'
            },
            {
                id: 'demo-comment-5',
                userId: 'demo-user-5',
                userName: 'Priya Sharma',
                userImage: 'https://i.pravatar.cc/150?img=9',
                content: 'Have a wonderful day!',
                timestamp: '2006-03-10T09:30:00Z'
            }
        ],
        timestamp: '2006-03-10T09:00:00Z',
        isDemo: true
    },
    {
        id: 'demo-post-4',
        userId: 'demo-user-4',
        userName: 'Carlos Mendes',
        userImage: 'https://i.pravatar.cc/150?img=13',
        content: 'Who else loves Orkut? Best social network ever!',
        type: 'text',
        likes: 31,
        comments: [],
        timestamp: '2006-04-05T16:45:00Z',
        isDemo: true
    },
    {
        id: 'demo-post-5',
        userId: 'demo-user-5',
        userName: 'Priya Sharma',
        userImage: 'https://i.pravatar.cc/150?img=9',
        content: 'Just uploaded new videos from my trip!',
        type: 'text',
        likes: 18,
        comments: [
            {
                id: 'demo-comment-6',
                userId: 'demo-user-1',
                userName: 'Maria Silva',
                userImage: 'https://i.pravatar.cc/150?img=1',
                content: 'Can\'t wait to watch them!',
                timestamp: '2006-05-12T11:20:00Z'
            }
        ],
        timestamp: '2006-05-12T11:00:00Z',
        isDemo: true
    },
    {
        id: 'demo-post-6',
        userId: 'demo-user-1',
        userName: 'Maria Silva',
        userImage: 'https://i.pravatar.cc/150?img=1',
        content: 'Missing the good old days...',
        type: 'text',
        likes: 12,
        comments: [],
        timestamp: '2006-06-20T13:30:00Z',
        isDemo: true
    },
    {
        id: 'demo-post-7',
        userId: 'demo-user-2',
        userName: 'João Santos',
        userImage: 'https://i.pravatar.cc/150?img=12',
        content: 'Anyone want to join my new community?',
        type: 'text',
        likes: 27,
        comments: [
            {
                id: 'demo-comment-7',
                userId: 'demo-user-3',
                userName: 'Ana Costa',
                userImage: 'https://i.pravatar.cc/150?img=5',
                content: 'Sure! What\'s it about?',
                timestamp: '2006-07-08T15:45:00Z'
            }
        ],
        timestamp: '2006-07-08T15:30:00Z',
        isDemo: true
    },
    {
        id: 'demo-post-8',
        userId: 'demo-user-3',
        userName: 'Ana Costa',
        userImage: 'https://i.pravatar.cc/150?img=5',
        content: 'Loving the new Orkut features!',
        type: 'text',
        likes: 20,
        comments: [],
        timestamp: '2006-08-15T10:00:00Z',
        isDemo: true
    },
    {
        id: 'demo-post-9',
        userId: 'demo-user-4',
        userName: 'Carlos Mendes',
        userImage: 'https://i.pravatar.cc/150?img=13',
        content: 'Weekend plans anyone?',
        type: 'text',
        likes: 8,
        comments: [
            {
                id: 'demo-comment-8',
                userId: 'demo-user-5',
                userName: 'Priya Sharma',
                userImage: 'https://i.pravatar.cc/150?img=9',
                content: 'Let\'s meet up!',
                timestamp: '2006-09-22T17:10:00Z'
            }
        ],
        timestamp: '2006-09-22T17:00:00Z',
        isDemo: true
    },
    {
        id: 'demo-post-10',
        userId: 'demo-user-5',
        userName: 'Priya Sharma',
        userImage: 'https://i.pravatar.cc/150?img=9',
        content: 'Thanks everyone for the amazing year on Orkut!',
        type: 'text',
        likes: 50,
        comments: [
            {
                id: 'demo-comment-9',
                userId: 'demo-user-1',
                userName: 'Maria Silva',
                userImage: 'https://i.pravatar.cc/150?img=1',
                content: 'You\'re awesome!',
                timestamp: '2006-12-31T23:50:00Z'
            },
            {
                id: 'demo-comment-10',
                userId: 'demo-user-2',
                userName: 'João Santos',
                userImage: 'https://i.pravatar.cc/150?img=12',
                content: 'Happy New Year!',
                timestamp: '2006-12-31T23:55:00Z'
            }
        ],
        timestamp: '2006-12-31T23:45:00Z',
        isDemo: true
    }
]

export const demoFriends = [
    {
        id: 'demo-user-1',
        name: 'Maria Silva',
        image: 'https://i.pravatar.cc/150?img=1',
        city: 'São Paulo',
        country: 'Brazil',
        relationship_status: 'Single',
        status: 'online',
        isDemo: true
    },
    {
        id: 'demo-user-2',
        name: 'João Santos',
        image: 'https://i.pravatar.cc/150?img=12',
        city: 'Rio de Janeiro',
        country: 'Brazil',
        relationship_status: 'In a relationship',
        status: 'away',
        isDemo: true
    },
    {
        id: 'demo-user-3',
        name: 'Ana Costa',
        image: 'https://i.pravatar.cc/150?img=5',
        city: 'Mumbai',
        country: 'India',
        relationship_status: 'Single',
        status: 'online',
        isDemo: true
    },
    {
        id: 'demo-user-4',
        name: 'Carlos Mendes',
        image: 'https://i.pravatar.cc/150?img=13',
        city: 'Lisbon',
        country: 'Portugal',
        relationship_status: 'Married',
        status: 'busy',
        isDemo: true
    },
    {
        id: 'demo-user-5',
        name: 'Priya Sharma',
        image: 'https://i.pravatar.cc/150?img=9',
        city: 'Delhi',
        country: 'India',
        relationship_status: 'Single',
        status: 'online',
        isDemo: true
    },
    {
        id: 'demo-user-6',
        name: 'Lucas Oliveira',
        image: 'https://i.pravatar.cc/150?img=14',
        city: 'Brasília',
        country: 'Brazil',
        relationship_status: 'Single',
        status: 'offline',
        isDemo: true
    },
    {
        id: 'demo-user-7',
        name: 'Sofia Rodriguez',
        image: 'https://i.pravatar.cc/150?img=10',
        city: 'Madrid',
        country: 'Spain',
        relationship_status: 'In a relationship',
        status: 'online',
        isDemo: true
    },
    {
        id: 'demo-user-8',
        name: 'Raj Patel',
        image: 'https://i.pravatar.cc/150?img=15',
        city: 'Bangalore',
        country: 'India',
        relationship_status: 'Single',
        status: 'away',
        isDemo: true
    }
]
