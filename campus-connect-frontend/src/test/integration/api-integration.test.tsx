import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// Mock fetch globally
global.fetch = vi.fn()

describe('API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(global.fetch as any).mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Basic API Integration', () => {
    it('should make POST requests with correct headers and body', async () => {
      const user = userEvent.setup()
      
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, id: 'test-123' })
      })

      const TestComponent = () => {
        const [result, setResult] = React.useState('')
        
        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault()
          const formData = new FormData(e.target as HTMLFormElement)
          
          const response = await fetch('/api/issues', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer test-token'
            },
            body: JSON.stringify({
              title: formData.get('title'),
              category: formData.get('category'),
              description: formData.get('description')
            })
          })
          
          if (response.ok) {
            const data = await response.json()
            setResult(`Success: ${data.id}`)
          }
        }

        return (
          <form onSubmit={handleSubmit}>
            <input name="title" placeholder="Issue title" />
            <select name="category">
              <option value="classroom">Classroom</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <textarea name="description" placeholder="Description" />
            <button type="submit">Submit Report</button>
            {result && <div data-testid="result">{result}</div>}
          </form>
        )
      }

      render(<TestComponent />)

      // Fill out the form
      await user.type(screen.getByPlaceholderText(/issue title/i), 'Broken projector')
      await user.selectOptions(screen.getByRole('combobox'), 'classroom')
      await user.type(screen.getByPlaceholderText(/description/i), 'The projector is not working')

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /submit report/i })
      await user.click(submitButton)

      // Verify API call was made with correct data
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/issues', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token'
          },
          body: JSON.stringify({
            title: 'Broken projector',
            category: 'classroom',
            description: 'The projector is not working'
          })
        })
      })

      // Should show success message
      expect(screen.getByTestId('result')).toHaveTextContent('Success: test-123')
    })

    it('should handle API errors correctly', async () => {
      const user = userEvent.setup()
      
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Validation failed' })
      })

      const TestComponent = () => {
        const [error, setError] = React.useState('')
        
        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault()
          
          const response = await fetch('/api/issues', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Test Issue' })
          })
          
          if (!response.ok) {
            const errorData = await response.json()
            setError(errorData.message)
          }
        }

        return (
          <form onSubmit={handleSubmit}>
            <button type="submit">Submit</button>
            {error && <div data-testid="error">{error}</div>}
          </form>
        )
      }

      render(<TestComponent />)

      const submitButton = screen.getByRole('button', { name: /submit/i })
      await user.click(submitButton)

      // Should show error message
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Validation failed')
      })
    })

    it('should fetch and display data from GET requests', async () => {
      const mockIssues = [
        { id: 'issue-1', title: 'First Issue', status: 'pending' },
        { id: 'issue-2', title: 'Second Issue', status: 'in-progress' }
      ]

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ issues: mockIssues })
      })

      const TestComponent = () => {
        const [issues, setIssues] = React.useState<any[]>([])
        const [loading, setLoading] = React.useState(false)
        
        const fetchIssues = async () => {
          setLoading(true)
          const response = await fetch('/api/issues/my-issues', {
            headers: { 'Authorization': 'Bearer test-token' }
          })
          
          if (response.ok) {
            const data = await response.json()
            setIssues(data.issues)
          }
          setLoading(false)
        }

        React.useEffect(() => {
          fetchIssues()
        }, [])

        return (
          <div>
            {loading && <div data-testid="loading">Loading...</div>}
            {issues.map(issue => (
              <div key={issue.id} data-testid="issue">
                <h3>{issue.title}</h3>
                <span>{issue.status}</span>
              </div>
            ))}
          </div>
        )
      }

      render(<TestComponent />)

      // Should make API call to fetch issues
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/issues/my-issues', {
          headers: { 'Authorization': 'Bearer test-token' }
        })
      })

      // Should display the issues
      await waitFor(() => {
        expect(screen.getByText('First Issue')).toBeInTheDocument()
        expect(screen.getByText('Second Issue')).toBeInTheDocument()
        expect(screen.getAllByTestId('issue')).toHaveLength(2)
      })
    })

    it('should handle PATCH requests for updates', async () => {
      const user = userEvent.setup()
      
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, status: 'in-progress' })
      })

      const TestComponent = () => {
        const [status, setStatus] = React.useState('pending')
        
        const updateStatus = async (newStatus: string) => {
          const response = await fetch('/api/issues/123/status', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer test-token'
            },
            body: JSON.stringify({ status: newStatus })
          })
          
          if (response.ok) {
            setStatus(newStatus)
          }
        }

        return (
          <div>
            <div data-testid="status">Status: {status}</div>
            <button onClick={() => updateStatus('in-progress')}>
              Update Status
            </button>
          </div>
        )
      }

      render(<TestComponent />)

      const updateButton = screen.getByRole('button', { name: /update status/i })
      await user.click(updateButton)

      // Should make PATCH API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/issues/123/status', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token'
          },
          body: JSON.stringify({ status: 'in-progress' })
        })
      })

      // Should update UI
      expect(screen.getByTestId('status')).toHaveTextContent('Status: in-progress')
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const user = userEvent.setup()
      
      // Mock network error
      ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

      const TestComponent = () => {
        const [error, setError] = React.useState('')
        
        const makeRequest = async () => {
          try {
            await fetch('/api/test')
          } catch (err) {
            setError('Network connection failed')
          }
        }

        return (
          <div>
            <button onClick={makeRequest}>Make Request</button>
            {error && <div data-testid="error">{error}</div>}
          </div>
        )
      }

      render(<TestComponent />)

      const button = screen.getByRole('button', { name: /make request/i })
      await user.click(button)

      // Should show network error message
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Network connection failed')
      })
    })

    it('should handle server errors (500) gracefully', async () => {
      const user = userEvent.setup()
      
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Internal server error' })
      })

      const TestComponent = () => {
        const [error, setError] = React.useState('')
        
        const makeRequest = async () => {
          const response = await fetch('/api/test')
          if (!response.ok) {
            const errorData = await response.json()
            setError(`Server error: ${errorData.message}`)
          }
        }

        return (
          <div>
            <button onClick={makeRequest}>Make Request</button>
            {error && <div data-testid="error">{error}</div>}
          </div>
        )
      }

      render(<TestComponent />)

      const button = screen.getByRole('button', { name: /make request/i })
      await user.click(button)

      // Should show server error message
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Server error: Internal server error')
      })
    })

    it('should handle unauthorized errors (401)', async () => {
      const user = userEvent.setup()
      
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' })
      })

      const TestComponent = () => {
        const [error, setError] = React.useState('')
        
        const makeRequest = async () => {
          const response = await fetch('/api/protected')
          if (response.status === 401) {
            setError('Session expired, please log in again')
          }
        }

        return (
          <div>
            <button onClick={makeRequest}>Make Request</button>
            {error && <div data-testid="error">{error}</div>}
          </div>
        )
      }

      render(<TestComponent />)

      const button = screen.getByRole('button', { name: /make request/i })
      await user.click(button)

      // Should handle unauthorized error
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Session expired, please log in again')
      })
    })
  })
})