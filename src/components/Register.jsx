import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as api from '../backend/api'
import '../css/Register.css'

function Register() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        birthDate: '',
        gender: '',
        country: 'United States',
        agreeTerms: false
    })
    const [error, setError] = useState('')

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!formData.agreeTerms) {
            setError('You must agree to the Terms of Use and Privacy Policy')
            return
        }

        try {
            await api.signUp(formData)
            alert('Registration successful! Please log in.')
            navigate('/login')
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.')
        }
    }

    const countries = [
        'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia',
        'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium',
        'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei',
        'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde',
        'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo',
        'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica',
        'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea',
        'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia',
        'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
        'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
        'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'North Korea',
        'South Korea', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia',
        'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi',
        'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
        'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
        'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria',
        'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru',
        'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis',
        'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
        'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia',
        'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'Spain', 'Sri Lanka', 'Sudan',
        'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania',
        'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
        'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay',
        'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
    ]

    return (
        <div className="register-container">
            <div className="register-content-wrapper">
                <div className="register-header-top">
                    <span className="logo-o">o</span>
                    <span className="logo-r">r</span>
                    <span className="logo-k">k</span>
                    <span className="logo-u">u</span>
                    <span className="logo-t">t</span>
                </div>

                <div className="register-box">
                    <h1 className="register-title">Welcome to Orkut Nostalgia!</h1>
                    <p className="register-subtitle">We just need to confirm a few things before you can start using Orkut:</p>

                    <form onSubmit={handleSubmit} className="register-form">
                        {error && <div className="register-error">{error}</div>}

                        <div className="register-form-row">
                            <div className="register-label-container">
                                <label>e-mail:</label>
                            </div>
                            <div className="register-input-container">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="register-form-row">
                            <div className="register-label-container">
                                <label>password:</label>
                            </div>
                            <div className="register-input-container">
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength="6"
                                />
                            </div>
                        </div>

                        <div className="register-form-row">
                            <div className="register-label-container">
                                <label>Excuse me for being nosy, but when were you born?</label>
                            </div>
                            <div className="register-input-container">
                                <input
                                    type="date"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="register-form-row">
                            <div className="register-label-container">
                                <label>Did we understand your name correctly?</label>
                            </div>
                            <div className="register-input-container">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="register-form-row">
                            <div className="register-label-container">
                                <label>sex:</label>
                            </div>
                            <div className="register-input-container">
                                <div className="radio-group">
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="masculine"
                                            checked={formData.gender === 'masculine'}
                                            onChange={handleChange}
                                            required
                                        />
                                        masculine
                                    </label>
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="feminine"
                                            checked={formData.gender === 'feminine'}
                                            onChange={handleChange}
                                        />
                                        feminine
                                    </label>
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="not-inform"
                                            checked={formData.gender === 'not-inform'}
                                            onChange={handleChange}
                                        />
                                        I do not wish to inform
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="register-form-row">
                            <div className="register-label-container">
                                <label>country:</label>
                            </div>
                            <div className="register-input-container">
                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    required
                                >
                                    {countries.map(country => (
                                        <option key={country} value={country}>{country}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="register-form-row terms-row">
                            <div className="register-label-container">
                                <label className="terms-label">
                                    Stand up, place your right hand on your chest and make the following oath by checking the box:
                                </label>
                            </div>
                            <div className="register-input-container">
                                <div className="terms-checkbox">
                                    <input
                                        type="checkbox"
                                        name="agreeTerms"
                                        checked={formData.agreeTerms}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span>
                                        I know I must be 18 or older to use Orkut Nostalgia. I am 18 or older and agree to abide by the{' '}
                                        <a href="#" className="terms-link">Terms of Use and Conduct</a> and the{' '}
                                        <a href="#" className="terms-link">Privacy Policy</a>.
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="register-btn">
                            Okay, you can create my account.
                        </button>
                    </form>

                    <div className="register-footer">
                        © 2025 Orkut Nostalgia{' '}
                        <a href="#" className="footer-link">About Orkut</a>{' '}
                        <a href="#" className="footer-link">Security Center</a>{' '}
                        <a href="#" className="footer-link">Privacy</a>{' '}
                        <a href="#" className="footer-link">Terms</a>{' '}
                        <a href="#" className="footer-link">Contact</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
