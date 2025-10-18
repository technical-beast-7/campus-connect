interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
  email?: boolean;
  password?: boolean;
  confirmPassword?: string;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

// Predefined validation rules for common form fields
export const validationRules = {
  // Authentication forms
  loginForm: {
    email: {
      required: true,
      email: true
    },
    password: {
      required: true,
      minLength: 6
    }
  } as ValidationRules,

  registerForm: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s]+$/,
      custom: (value: string) => {
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters and spaces';
        return null;
      }
    },
    email: {
      required: true,
      email: true
    },
    password: {
      required: true,
      password: true
    },
    confirmPassword: {
      required: true,
      confirmPassword: 'password'
    },
    department: {
      required: true,
      minLength: 2
    },
    role: {
      required: true
    }
  } as ValidationRules,

  // Issue reporting form
  reportIssueForm: {
    title: {
      required: true,
      minLength: 5,
      maxLength: 100,
      custom: (value: string) => {
        if (value.trim().length < 5) return 'Title must be at least 5 characters';
        if (value.trim().length > 100) return 'Title must be no more than 100 characters';
        return null;
      }
    },
    category: {
      required: true
    },
    description: {
      required: true,
      minLength: 10,
      maxLength: 1000,
      custom: (value: string) => {
        if (value.trim().length < 10) return 'Description must be at least 10 characters';
        if (value.trim().length > 1000) return 'Description must be no more than 1000 characters';
        return null;
      }
    }
  } as ValidationRules,

  // Profile update form
  profileForm: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s]+$/
    },
    email: {
      required: true,
      email: true
    },
    department: {
      required: true,
      minLength: 2
    }
  } as ValidationRules,

  // Comment form
  commentForm: {
    comment: {
      required: true,
      minLength: 5,
      maxLength: 500,
      custom: (value: string) => {
        if (value.trim().length < 5) return 'Comment must be at least 5 characters';
        if (value.trim().length > 500) return 'Comment must be no more than 500 characters';
        return null;
      }
    }
  } as ValidationRules
};

// Individual field validation rules for reuse
export const fieldRules = {
  email: {
    required: true,
    email: true
  },
  password: {
    required: true,
    password: true
  },
  confirmPassword: (passwordField: string = 'password') => ({
    required: true,
    confirmPassword: passwordField
  }),
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/
  },
  title: {
    required: true,
    minLength: 5,
    maxLength: 100
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 1000
  },
  department: {
    required: true,
    minLength: 2
  },
  required: {
    required: true
  }
};

export default validationRules;