import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import API from '../api'
import { useToast } from './ToastProvider'

const ProfileModal = ({ open, onClose, user, onUpdated }) => {
  const [profileForm, setProfileForm] = useState({ name: '', email: '' })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    if (user && open) {
      setProfileForm({ name: user.name || '', email: user.email || '' })
      setPasswordForm({ currentPassword: '', newPassword: '' })
    }
  }, [user, open])

  const handleProfileSave = async (e) => {
    e.preventDefault()
    try {
      setSavingProfile(true)
      const { name, email } = profileForm
      await API.put('/api/auth/profile', { name, email })
      addToast('success', 'Profile updated')
      if (onUpdated) await onUpdated()
    } catch (err) {
      addToast('error', err.response?.data?.msg || 'Unable to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault()
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      addToast('error', 'Please fill in both password fields')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      addToast('error', 'New password must be at least 6 characters')
      return
    }

    try {
      setSavingPassword(true)
      const response = await API.put('/api/auth/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
      addToast('success', 'Password updated successfully')
      setPasswordForm({ currentPassword: '', newPassword: '' })
    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.message || 'Unable to update password'
      addToast('error', errorMsg)
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Account settings" footer={null}>
      <div className="profile-modal">
        <form onSubmit={handleProfileSave} className="mb-4">
          <h6>Profile details</h6>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input className="form-control" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={savingProfile}>{savingProfile ? 'Saving...' : 'Save profile'}</button>
        </form>

        <form onSubmit={handlePasswordSave}>
          <h6>Change password</h6>
          <div className="mb-3">
            <label className="form-label">Current password</label>
            <input 
              type="password" 
              className="form-control" 
              value={passwordForm.currentPassword} 
              onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} 
              required 
              autoComplete="current-password"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">New password</label>
            <input 
              type="password" 
              className="form-control" 
              value={passwordForm.newPassword} 
              onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} 
              required 
              minLength={6}
              autoComplete="new-password"
            />
            <small className="text-muted">At least 6 characters</small>
          </div>
          <button type="submit" className="btn btn-outline-primary" disabled={savingPassword}>{savingPassword ? 'Updating...' : 'Update password'}</button>
        </form>
      </div>
    </Modal>
  )
}

export default ProfileModal
