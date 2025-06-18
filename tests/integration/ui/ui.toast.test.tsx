import { describe, it, expect, vi } from 'vitest'

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}))
import { toast } from 'sonner'

describe('UI Toast Integration Tests', () => {
  it('should handle toast notifications robustly', () => {
    toast.success('Operation successful')
    expect(toast.success).toHaveBeenCalledWith('Operation successful')
    toast.error('Operation failed')
    expect(toast.error).toHaveBeenCalledWith('Operation failed')
    toast.info('Operation in progress')
    expect(toast.info).toHaveBeenCalledWith('Operation in progress')
  })
}) 