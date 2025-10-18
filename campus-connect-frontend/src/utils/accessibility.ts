// Accessibility utilities and helpers

/**
 * Announces a message to screen readers using a live region
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', priority);
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  liveRegion.textContent = message;
  
  document.body.appendChild(liveRegion);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(liveRegion);
  }, 1000);
};

/**
 * Manages focus for modal dialogs and overlays
 */
export class FocusTrap {
  private element: HTMLElement;
  private previousActiveElement: Element | null;
  private focusableElements: HTMLElement[];

  constructor(element: HTMLElement) {
    this.element = element;
    this.previousActiveElement = document.activeElement;
    this.focusableElements = this.getFocusableElements();
  }

  private getFocusableElements(): HTMLElement[] {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(this.element.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }

  public activate(): void {
    // Focus first focusable element
    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
    }

    // Add event listeners
    this.element.addEventListener('keydown', this.handleKeyDown);
  }

  public deactivate(): void {
    // Remove event listeners
    this.element.removeEventListener('keydown', this.handleKeyDown);

    // Restore focus to previous element
    if (this.previousActiveElement && 'focus' in this.previousActiveElement) {
      (this.previousActiveElement as HTMLElement).focus();
    }
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Tab') {
      this.handleTabKey(event);
    } else if (event.key === 'Escape') {
      this.handleEscapeKey(event);
    }
  };

  private handleTabKey(event: KeyboardEvent): void {
    if (this.focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  private handleEscapeKey(event: KeyboardEvent): void {
    event.preventDefault();
    this.deactivate();
    
    // Dispatch custom event for parent components to handle
    this.element.dispatchEvent(new CustomEvent('focustrap:escape'));
  }
}

/**
 * Checks if an element has sufficient color contrast
 */
export const checkColorContrast = (foreground: string, background: string): boolean => {
  // This is a simplified check - in a real app, you'd use a proper color contrast library
  const getLuminance = (color: string): number => {
    // Convert hex to RGB and calculate luminance
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const sRGB = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const contrast = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  
  return contrast >= 4.5; // WCAG AA standard
};

/**
 * Generates a unique ID for form elements and ARIA relationships
 */
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Keyboard navigation helpers
 */
export const KeyboardNavigation = {
  /**
   * Handles arrow key navigation for lists and grids
   */
  handleArrowKeys: (
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    orientation: 'horizontal' | 'vertical' | 'both' = 'vertical'
  ): number => {
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault();
          newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        }
        break;
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault();
          newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        }
        break;
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault();
          newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        }
        break;
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault();
          newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        }
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = items.length - 1;
        break;
    }

    if (newIndex !== currentIndex && items[newIndex]) {
      items[newIndex].focus();
    }

    return newIndex;
  },

  /**
   * Handles Enter and Space key activation
   */
  handleActivation: (event: KeyboardEvent, callback: () => void): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  }
};

/**
 * Screen reader utilities
 */
export const ScreenReader = {
  /**
   * Checks if a screen reader is likely being used
   */
  isActive: (): boolean => {
    // Check for common screen reader indicators
    return !!(
      window.navigator.userAgent.includes('NVDA') ||
      window.navigator.userAgent.includes('JAWS') ||
      window.speechSynthesis ||
      document.querySelector('[aria-live]')
    );
  },

  /**
   * Announces status changes
   */
  announceStatus: (message: string): void => {
    announceToScreenReader(message, 'polite');
  },

  /**
   * Announces urgent messages
   */
  announceAlert: (message: string): void => {
    announceToScreenReader(message, 'assertive');
  }
};

/**
 * Form accessibility helpers
 */
export const FormAccessibility = {
  /**
   * Associates form controls with error messages
   */
  linkErrorMessage: (inputId: string, errorId: string): void => {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    
    if (input && error) {
      const describedBy = input.getAttribute('aria-describedby');
      const newDescribedBy = describedBy ? `${describedBy} ${errorId}` : errorId;
      input.setAttribute('aria-describedby', newDescribedBy);
      input.setAttribute('aria-invalid', 'true');
    }
  },

  /**
   * Removes error message association
   */
  unlinkErrorMessage: (inputId: string, errorId: string): void => {
    const input = document.getElementById(inputId);
    
    if (input) {
      const describedBy = input.getAttribute('aria-describedby');
      if (describedBy) {
        const newDescribedBy = describedBy
          .split(' ')
          .filter(id => id !== errorId)
          .join(' ');
        
        if (newDescribedBy) {
          input.setAttribute('aria-describedby', newDescribedBy);
        } else {
          input.removeAttribute('aria-describedby');
        }
      }
      input.setAttribute('aria-invalid', 'false');
    }
  }
};

/**
 * Accessibility testing utilities
 */
export const AccessibilityTesting = {
  /**
   * Checks for common accessibility issues
   */
  auditPage: (): string[] => {
    const issues: string[] = [];

    // Check for missing alt text on images
    const images = document.querySelectorAll('img:not([alt])');
    if (images.length > 0) {
      issues.push(`${images.length} images missing alt text`);
    }

    // Check for missing form labels
    const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    const unlabeledInputs = Array.from(inputs).filter(input => {
      const id = input.getAttribute('id');
      return !id || !document.querySelector(`label[for="${id}"]`);
    });
    if (unlabeledInputs.length > 0) {
      issues.push(`${unlabeledInputs.length} form inputs missing labels`);
    }

    // Check for missing heading structure
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length === 0) {
      issues.push('No heading elements found');
    }

    // Check for missing main landmark
    const main = document.querySelector('main, [role="main"]');
    if (!main) {
      issues.push('No main landmark found');
    }

    return issues;
  },

  /**
   * Logs accessibility audit results to console
   */
  logAuditResults: (): void => {
    const issues = AccessibilityTesting.auditPage();
    
    if (issues.length === 0) {
      console.log('✅ No accessibility issues found');
    } else {
      console.warn('⚠️ Accessibility issues found:');
      issues.forEach(issue => console.warn(`  - ${issue}`));
    }
  }
};

// Run accessibility audit in development mode
if (process.env.NODE_ENV === 'development') {
  // Run audit after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      AccessibilityTesting.logAuditResults();
    }, 1000);
  });
}