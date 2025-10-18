import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, userEvent } from '../../../test/utils'
import { mockUser, mockAuthorityUser, mockIssue } from '../../../test/utils'
import IssueCard from '../IssueCard'
import type { Issue, IssueStatus } from '../../../types'

describe('IssueCard', () => {
  const mockOnStatusChange = vi.fn()
  const mockOnAddComment = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('basic rendering', () => {
    it('renders issue information correctly', () => {
      render(
        <IssueCard 
          issue={mockIssue} 
          currentUser={mockUser}
          onStatusChange={mockOnStatusChange}
          onAddComment={mockOnAddComment}
        />
      )

      expect(screen.getByText(mockIssue.title)).toBeInTheDocument()
      expect(screen.getByText(mockIssue.description)).toBeInTheDocument()
      expect(screen.getByText('Classroom')).toBeInTheDocument() // category
      expect(screen.getByRole('status')).toBeInTheDocument() // status badge
    })

    it('displays formatted dates correctly', () => {
      render(
        <IssueCard 
          issue={mockIssue} 
          currentUser={mockUser}
        />
      )

      expect(screen.getByText(/Created:/)).toBeInTheDocument()
      expect(screen.getByText(/Updated:/)).toBeInTheDocument()
    })

    it('shows image when imageUrl is provided', () => {
      render(
        <IssueCard 
          issue={mockIssue} 
          currentUser={mockUser}
        />
      )

      const image = screen.getByAltText('Issue attachment')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', mockIssue.imageUrl)
    })

    it('does not show image when imageUrl is not provided', () => {
      const issueWithoutImage = { ...mockIssue, imageUrl: undefined }
      render(
        <IssueCard 
          issue={issueWithoutImage} 
          currentUser={mockUser}
        />
      )

      expect(screen.queryByAltText('Issue attachment')).not.toBeInTheDocument()
    })
  })

  describe('role-based rendering', () => {
    it('shows reporter information for authority users', () => {
      render(
        <IssueCard 
          issue={mockIssue} 
          currentUser={mockAuthorityUser}
          onStatusChange={mockOnStatusChange}
        />
      )

      expect(screen.getByText(/Reported by:/)).toBeInTheDocument()
      expect(screen.getByText(mockIssue.reporterName)).toBeInTheDocument()
      expect(screen.getByText(/Department:/)).toBeInTheDocument()
      expect(screen.getByText((content, element) => {
        return element?.textContent?.includes(mockIssue.reporterDepartment) || false
      })).toBeInTheDocument()
    })

    it('does not show reporter information for non-authority users', () => {
      render(
        <IssueCard 
          issue={mockIssue} 
          currentUser={mockUser}
        />
      )

      expect(screen.queryByText(/Reported by:/)).not.toBeInTheDocument()
    })

    it('shows status change dropdown for authority users', () => {
      render(
        <IssueCard 
          issue={mockIssue} 
          currentUser={mockAuthorityUser}
          onStatusChange={mockOnStatusChange}
        />
      )

      const statusSelect = screen.getByLabelText('Change issue status')
      expect(statusSelect).toBeInTheDocument()
      expect(statusSelect).toHaveValue(mockIssue.status)
    })

    it('does not show status change dropdown for non-authority users', () => {
      render(
        <IssueCard 
          issue={mockIssue} 
          currentUser={mockUser}
        />
      )

      expect(screen.queryByLabelText('Change issue status')).not.toBeInTheDocument()
    })
  })

  describe('user interactions', () => {
    it('expands and collapses description when "Show more/less" is clicked', async () => {
      const user = userEvent.setup()
      const longDescription = 'A'.repeat(200) // Long description to trigger show more
      const issueWithLongDescription = { ...mockIssue, description: longDescription }
      
      render(
        <IssueCard 
          issue={issueWithLongDescription} 
          currentUser={mockUser}
        />
      )

      const showMoreButton = screen.getByText('Show more')
      expect(showMoreButton).toBeInTheDocument()

      await user.click(showMoreButton)
      expect(screen.getByText('Show less')).toBeInTheDocument()

      await user.click(screen.getByText('Show less'))
      expect(screen.getByText('Show more')).toBeInTheDocument()
    })

    it('toggles comments section when comments button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <IssueCard 
          issue={mockIssue} 
          currentUser={mockUser}
        />
      )

      const commentsButton = screen.getByRole('button', { name: /Show 1 comments for issue/ })
      expect(commentsButton).toBeInTheDocument()
      expect(commentsButton).toHaveAttribute('aria-expanded', 'false')

      await user.click(commentsButton)
      expect(commentsButton).toHaveAttribute('aria-expanded', 'true')
      expect(screen.getByRole('region', { name: 'Comments section' })).toBeInTheDocument()
    })

    it('calls onStatusChange when authority changes status', async () => {
      const user = userEvent.setup()
      render(
        <IssueCard 
          issue={mockIssue} 
          currentUser={mockAuthorityUser}
          onStatusChange={mockOnStatusChange}
        />
      )

      const statusSelect = screen.getByLabelText('Change issue status')
      await user.selectOptions(statusSelect, 'in-progress')

      expect(mockOnStatusChange).toHaveBeenCalledWith(mockIssue.id, 'in-progress')
    })

    it('opens image in new window when clicked', async () => {
      const user = userEvent.setup()
      const mockWindowOpen = vi.fn()
      vi.stubGlobal('window', { ...window, open: mockWindowOpen })

      render(
        <IssueCard 
          issue={mockIssue} 
          currentUser={mockUser}
        />
      )

      const image = screen.getByAltText('Issue attachment')
      await user.click(image)

      expect(mockWindowOpen).toHaveBeenCalledWith(mockIssue.imageUrl, '_blank')
    })
  })

  describe('comments functionality', () => {
    it('displays existing comments correctly', async () => {
      const user = userEvent.setup()
      render(
        <IssueCard 
          issue={mockIssue} 
          currentUser={mockUser}
        />
      )

      await user.click(screen.getByRole('button', { name: /Show 1 comments for issue/ }))

      expect(screen.getByText(mockIssue.comments[0].content)).toBeInTheDocument()
      expect(screen.getByText(mockIssue.comments[0].authorName)).toBeInTheDocument()
    })

    it('shows comment form for authority users', async () => {
      const user = userEvent.setup()
      render(
        <IssueCard 
          issue={mockIssue} 
          currentUser={mockAuthorityUser}
          onAddComment={mockOnAddComment}
        />
      )

      await user.click(screen.getByRole('button', { name: /Comments/ }))

      expect(screen.getByPlaceholderText('Add an official response...')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Post Response/ })).toBeInTheDocument()
    })

    it('shows comment form for issue owner', async () => {
      const user = userEvent.setup()
      render(
        <IssueCard 
          issue={mockIssue} 
          currentUser={mockUser} // mockUser is the issue owner
          onAddComment={mockOnAddComment}
        />
      )

      await user.click(screen.getByRole('button', { name: /Comments/ }))

      expect(screen.getByPlaceholderText('Add a comment...')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Add Comment/ })).toBeInTheDocument()
    })

    it('does not show comment form for non-owner, non-authority users', async () => {
      const user = userEvent.setup()
      const otherUser = { ...mockUser, id: 'other-user' }
      
      render(
        <IssueCard 
          issue={mockIssue} 
          currentUser={otherUser}
          onAddComment={mockOnAddComment}
        />
      )

      await user.click(screen.getByRole('button', { name: /Comments/ }))

      expect(screen.queryByPlaceholderText(/Add/)).not.toBeInTheDocument()
    })

    it('submits comment when form is filled and submitted', async () => {
      const user = userEvent.setup()
      render(
        <IssueCard 
          issue={mockIssue} 
          currentUser={mockAuthorityUser}
          onAddComment={mockOnAddComment}
        />
      )

      await user.click(screen.getByRole('button', { name: /Comments/ }))

      const textarea = screen.getByPlaceholderText('Add an official response...')
      const submitButton = screen.getByRole('button', { name: /Post Response/ })

      await user.type(textarea, 'This is a test comment')
      await user.click(submitButton)

      expect(mockOnAddComment).toHaveBeenCalledWith(mockIssue.id, 'This is a test comment')
    })

    it('clears comment form after successful submission', async () => {
      const user = userEvent.setup()
      mockOnAddComment.mockResolvedValue(undefined)
      
      render(
        <IssueCard 
          issue={mockIssue} 
          currentUser={mockAuthorityUser}
          onAddComment={mockOnAddComment}
        />
      )

      await user.click(screen.getByRole('button', { name: /Comments/ }))

      const textarea = screen.getByPlaceholderText('Add an official response...')
      const submitButton = screen.getByRole('button', { name: /Post Response/ })

      await user.type(textarea, 'Test comment')
      await user.click(submitButton)

      // Wait for the form to clear
      await vi.waitFor(() => {
        expect(textarea).toHaveValue('')
      })
    })

    it('cancels comment when cancel button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <IssueCard 
          issue={mockIssue} 
          currentUser={mockAuthorityUser}
          onAddComment={mockOnAddComment}
        />
      )

      await user.click(screen.getByRole('button', { name: /Comments/ }))

      const textarea = screen.getByPlaceholderText('Add an official response...')
      await user.type(textarea, 'Test comment')

      const cancelButton = screen.getByRole('button', { name: /Cancel/ })
      await user.click(cancelButton)

      expect(textarea).toHaveValue('')
    })
  })

  describe('accessibility', () => {
    it('has proper ARIA attributes for comments section', async () => {
      const user = userEvent.setup()
      render(
        <IssueCard 
          issue={mockIssue} 
          currentUser={mockUser}
        />
      )

      const commentsButton = screen.getByRole('button', { name: /Comments/ })
      expect(commentsButton).toHaveAttribute('aria-expanded', 'false')
      expect(commentsButton).toHaveAttribute('aria-controls', `comments-${mockIssue.id}`)

      await user.click(commentsButton)
      expect(commentsButton).toHaveAttribute('aria-expanded', 'true')
    })

    it('has proper labels for form elements', async () => {
      const user = userEvent.setup()
      render(
        <IssueCard 
          issue={mockIssue} 
          currentUser={mockAuthorityUser}
          onAddComment={mockOnAddComment}
        />
      )

      await user.click(screen.getByRole('button', { name: /Comments/ }))

      const textarea = screen.getByLabelText(/Add an official response to this issue/)
      expect(textarea).toBeInTheDocument()
    })

    it('shows loading state with proper accessibility attributes', async () => {
      const user = userEvent.setup()
      mockOnAddComment.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
      
      render(
        <IssueCard 
          issue={mockIssue} 
          currentUser={mockAuthorityUser}
          onAddComment={mockOnAddComment}
        />
      )

      await user.click(screen.getByRole('button', { name: /Comments/ }))

      const textarea = screen.getByPlaceholderText('Add an official response...')
      const submitButton = screen.getByRole('button', { name: /Post Response/ })

      await user.type(textarea, 'Test comment')
      await user.click(submitButton)

      expect(screen.getByRole('button', { name: /Adding comment.../ })).toBeInTheDocument()
    })
  })

  describe('error handling', () => {
    it('handles status change errors gracefully', async () => {
      const user = userEvent.setup()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockOnStatusChange.mockRejectedValue(new Error('Status change failed'))

      render(
        <IssueCard 
          issue={mockIssue} 
          currentUser={mockAuthorityUser}
          onStatusChange={mockOnStatusChange}
        />
      )

      const statusSelect = screen.getByLabelText('Change issue status')
      await user.selectOptions(statusSelect, 'in-progress')

      expect(consoleSpy).toHaveBeenCalledWith('Failed to update status:', expect.any(Error))
      consoleSpy.mockRestore()
    })

    it('handles comment submission errors gracefully', async () => {
      const user = userEvent.setup()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockOnAddComment.mockRejectedValue(new Error('Comment submission failed'))

      render(
        <IssueCard 
          issue={mockIssue} 
          currentUser={mockAuthorityUser}
          onAddComment={mockOnAddComment}
        />
      )

      await user.click(screen.getByRole('button', { name: /Comments/ }))

      const textarea = screen.getByPlaceholderText('Add an official response...')
      const submitButton = screen.getByRole('button', { name: /Post Response/ })

      await user.type(textarea, 'Test comment')
      await user.click(submitButton)

      await vi.waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to add comment:', expect.any(Error))
      })
      
      consoleSpy.mockRestore()
    })
  })

  describe('edge cases', () => {
    it('handles issue with no comments', () => {
      const issueWithoutComments = { ...mockIssue, comments: [] }
      render(
        <IssueCard 
          issue={issueWithoutComments} 
          currentUser={mockUser}
        />
      )

      expect(screen.getByText(/Comments \(0\)/)).toBeInTheDocument()
    })

    it('handles very long issue titles', () => {
      const issueWithLongTitle = { 
        ...mockIssue, 
        title: 'A'.repeat(200) 
      }
      render(
        <IssueCard 
          issue={issueWithLongTitle} 
          currentUser={mockUser}
        />
      )

      expect(screen.getByText(issueWithLongTitle.title)).toBeInTheDocument()
    })

    it('handles missing optional props gracefully', () => {
      render(
        <IssueCard 
          issue={mockIssue} 
          currentUser={mockUser}
        />
      )

      // Should render without errors even without onStatusChange and onAddComment
      expect(screen.getByText(mockIssue.title)).toBeInTheDocument()
    })
  })
})