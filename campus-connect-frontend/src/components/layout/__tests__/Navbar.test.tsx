import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, userEvent } from '../../../test/utils'
import { mockUser, mockAuthorityUser } from '../../../test/utils'
import Navbar from '../Navbar'

describe('Navbar', () => {
  const mockOnLogout = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering without user', () => {
    it('renders brand logo and name', () => {
      render(<Navbar onLogout={mockOnLogout} />)

      expect(screen.getByText('Campus Connect')).toBeInTheDocument()
      expect(screen.getByText('Issue Management')).toBeInTheDocument()
      
      const logo = screen.getByText('CC')
      expect(logo).toBeInTheDocument()
      expect(logo.closest('div')).toHaveClass('bg-gradient-to-br', 'from-primary-500', 'to-primary-700')
    })

    it('does not show user information when no user provided', () => {
      render(<Navbar onLogout={mockOnLogout} />)

      expect(screen.queryByText(/logout/i)).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /menu/i })).not.toBeInTheDocument()
    })
  })

  describe('rendering with user', () => {
    it('displays user information in desktop view', () => {
      render(<Navbar user={mockUser} onLogout={mockOnLogout} />)

      expect(screen.getByText(mockUser.name)).toBeInTheDocument()
      expect(screen.getByText(mockUser.role)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
    })

    it('shows user avatar when provided', () => {
      const userWithAvatar = { ...mockUser, avatar: 'https://example.com/avatar.jpg' }
      render(<Navbar user={userWithAvatar} onLogout={mockOnLogout} />)

      const avatar = screen.getByAltText(userWithAvatar.name)
      expect(avatar).toBeInTheDocument()
      expect(avatar).toHaveAttribute('src', userWithAvatar.avatar)
    })

    it('displays mobile menu button when user is present', () => {
      render(<Navbar user={mockUser} onLogout={mockOnLogout} />)

      const menuButton = screen.getByRole('button', { name: /open main menu/i })
      expect(menuButton).toBeInTheDocument()
      expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('user interactions', () => {
    it('calls onLogout when desktop logout button is clicked', async () => {
      const user = userEvent.setup()
      render(<Navbar user={mockUser} onLogout={mockOnLogout} />)

      const logoutButton = screen.getByRole('button', { name: /logout/i })
      await user.click(logoutButton)

      expect(mockOnLogout).toHaveBeenCalledTimes(1)
    })

    it('toggles mobile menu when menu button is clicked', async () => {
      const user = userEvent.setup()
      render(<Navbar user={mockUser} onLogout={mockOnLogout} />)

      const menuButton = screen.getByRole('button', { name: /open main menu/i })
      expect(menuButton).toHaveAttribute('aria-expanded', 'false')

      await user.click(menuButton)
      expect(menuButton).toHaveAttribute('aria-expanded', 'true')
      expect(screen.getByRole('button', { name: /close main menu/i })).toBeInTheDocument()
    })

    it('shows mobile menu content when opened', async () => {
      const user = userEvent.setup()
      render(<Navbar user={mockUser} onLogout={mockOnLogout} />)

      const menuButton = screen.getByRole('button', { name: /open main menu/i })
      await user.click(menuButton)

      expect(screen.getByRole('menu')).toBeInTheDocument()
      expect(screen.getByText(mockUser.department)).toBeInTheDocument()
    })

    it('calls onLogout and closes mobile menu when mobile logout is clicked', async () => {
      const user = userEvent.setup()
      render(<Navbar user={mockUser} onLogout={mockOnLogout} />)

      const menuButton = screen.getByRole('button', { name: /open main menu/i })
      await user.click(menuButton)

      const mobileLogoutButton = screen.getByRole('menuitem', { name: /logout from your account/i })
      await user.click(mobileLogoutButton)

      expect(mockOnLogout).toHaveBeenCalledTimes(1)
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })
  })  
describe('accessibility', () => {
    it('has proper navigation landmark', () => {
      render(<Navbar user={mockUser} onLogout={mockOnLogout} />)

      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
    })

    it('has proper ARIA attributes for mobile menu', async () => {
      const user = userEvent.setup()
      render(<Navbar user={mockUser} onLogout={mockOnLogout} />)

      const menuButton = screen.getByRole('button', { name: /open main menu/i })
      expect(menuButton).toHaveAttribute('aria-expanded', 'false')
      expect(menuButton).toHaveAttribute('aria-controls', 'mobile-menu')

      await user.click(menuButton)
      expect(menuButton).toHaveAttribute('aria-expanded', 'true')

      const mobileMenu = screen.getByRole('menu')
      expect(mobileMenu).toHaveAttribute('id', 'mobile-menu')
    })

    it('has keyboard navigation support', () => {
      render(<Navbar user={mockUser} onLogout={mockOnLogout} />)

      const menuButton = screen.getByRole('button', { name: /open main menu/i })
      expect(menuButton).toHaveClass('keyboard-nav')
    })
  })

  describe('edge cases', () => {
    it('handles user without department gracefully', () => {
      const userWithoutDepartment = { ...mockUser, department: '' }
      render(<Navbar user={userWithoutDepartment} onLogout={mockOnLogout} />)

      expect(screen.getByText(userWithoutDepartment.name)).toBeInTheDocument()
    })

    it('handles very long user names', () => {
      const userWithLongName = { ...mockUser, name: 'A'.repeat(50) }
      render(<Navbar user={userWithLongName} onLogout={mockOnLogout} />)

      expect(screen.getByText(userWithLongName.name)).toBeInTheDocument()
    })
  })
})