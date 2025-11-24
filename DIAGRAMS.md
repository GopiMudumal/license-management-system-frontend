# Frontend - Flow Diagrams

This document contains Mermaid flow diagrams specific to the frontend application.

## Frontend Architecture

```mermaid
graph TB
    subgraph "Next.js Application"
        A[Home Page] --> B[Admin Portal]
        A --> C[Customer Portal]
        B --> D[Admin Login]
        C --> E[Customer Login]
        C --> F[Customer Signup]
        D --> G[Admin Dashboard]
        E --> H[Customer Dashboard]
        F --> H
    end
    
    subgraph "Components"
        I[Layout Component] --> J[Theme Toggle]
        I --> K[Global Loader]
        I --> L[Navigation]
        J --> M[Theme Store]
        K --> N[API Interceptor]
    end
    
    subgraph "State Management"
        M[Theme Store - Zustand]
        O[Auth Store - Zustand]
    end
    
    subgraph "API Layer"
        N[API Client - Axios]
        P[JWT Token Management]
        Q[Request/Response Interceptors]
    end
    
    G --> I
    H --> I
    I --> O
    N --> P
    N --> Q
    Q --> R[Backend API]
    
    style A fill:#e1f5ff
    style G fill:#fff4e6
    style H fill:#e8f5e9
    style M fill:#f3e5f5
    style O fill:#f3e5f5
```

## Theme System Flow

```mermaid
flowchart TD
    A[User Opens App] --> B[ThemeInitializer Component]
    B --> C{Check localStorage<br/>for Theme}
    
    C -->|Theme Found| D[Load Saved Theme]
    C -->|No Theme| E[Use Default: Avengers]
    
    D --> F[Update Zustand Theme Store]
    E --> F
    
    F --> G[Set data-theme Attribute on HTML]
    G --> H[CSS Variables Applied]
    
    H --> I[User Clicks Theme Toggle]
    I --> J[Show Theme Dropdown Menu]
    J --> K[User Selects Theme]
    
    K --> L[Update Zustand Store]
    L --> M[Save to localStorage]
    M --> N[Update data-theme Attribute]
    N --> O[CSS Variables Update]
    O --> P[All Components Re-render<br/>with New Theme Colors]
    
    P --> Q[UI Updates with New Theme]
    
    style A fill:#e1f5ff
    style K fill:#fff4e6
    style P fill:#c8e6c9
    style Q fill:#c8e6c9
```

## API Request Flow with Global Loader

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Frontend UI
    participant GL as Global Loader
    participant API as API Client
    participant B as Backend
    
    U->>UI: Click Button (API Action)
    UI->>GL: Dispatch 'api-loading-start' Event
    GL->>GL: Show Loader (Theme-Aware Animation)
    
    UI->>API: Make API Request
    API->>API: Check localStorage for Token
    API->>API: Add JWT Token to Header
    API->>B: HTTP Request
    
    B->>B: Process Request
    B-->>API: JSON Response
    
    API->>GL: Dispatch 'api-loading-end' Event
    
    alt Min Loading Time Not Met
        GL->>GL: Calculate Remaining Time
        GL->>GL: Wait for Remaining Duration
    end
    
    GL->>GL: Hide Loader (Smooth Fade)
    API->>UI: Return Data
    UI->>U: Update UI with Results
    
    Note over GL: Loader shows theme-specific<br/>animations, colors, and emojis
```

## Authentication State Management

```mermaid
stateDiagram-v2
    [*] --> NotAuthenticated: App Loads
    
    NotAuthenticated --> CheckingToken: Check localStorage
    CheckingToken --> Authenticated: Valid Token Found
    CheckingToken --> NotAuthenticated: No/Invalid Token
    
    NotAuthenticated --> LoggingIn: User Enters Credentials
    LoggingIn --> Authenticated: Login Success
    LoggingIn --> NotAuthenticated: Login Failed
    
    Authenticated --> StoringToken: Save Token to localStorage
    StoringToken --> UpdatingStore: Update Zustand Store
    UpdatingStore --> Redirecting: Redirect to Dashboard
    Redirecting --> [*]
    
    Authenticated --> LoggingOut: User Clicks Logout
    LoggingOut --> ClearingToken: Remove Token
    ClearingToken --> ClearingStore: Clear Zustand Store
    ClearingStore --> NotAuthenticated
    
    note right of Authenticated
        Token stored in:
        - localStorage
        - Zustand store
        - Axios interceptor
    end note
```

## Customer Subscription Request Flow

```mermaid
flowchart TD
    Start([Customer on Subscription Page]) --> Load[Load Available Packs]
    Load --> Display[Display Packs in Dropdown]
    Display --> Select{User Selects Pack?}
    
    Select -->|No| Wait[Wait for Selection]
    Wait --> Select
    
    Select -->|Yes| Validate{Has Active<br/>Subscription?}
    
    Validate -->|Yes| Error1[Show Error:<br/>Active subscription exists]
    Validate -->|No| CheckPending{Has Pending<br/>Request?}
    
    CheckPending -->|Yes| Error2[Show Error:<br/>Pending request exists]
    CheckPending -->|No| ShowLoader[Show Global Loader]
    
    ShowLoader --> API[POST /api/v1/customer/subscription]
    API --> Response{Response?}
    
    Response -->|Success| SuccessMsg[Show Success Message]
    Response -->|Error| ErrorMsg[Show Error Message]
    
    SuccessMsg --> Refresh[Refresh Subscription Data]
    ErrorMsg --> HideLoader[Hide Loader]
    Refresh --> HideLoader
    HideLoader --> End([End])
    Error1 --> End
    Error2 --> End
    
    style Start fill:#e1f5ff
    style SuccessMsg fill:#c8e6c9
    style Error1 fill:#ffcdd2
    style Error2 fill:#ffcdd2
    style ErrorMsg fill:#ffcdd2
```

## Admin Subscription Management UI Flow

```mermaid
flowchart LR
    A[Admin Subscriptions Page] --> B[Load Subscriptions]
    B --> C[Display Table]
    
    C --> D{User Action}
    
    D -->|Approve| E[Approve Button]
    D -->|Reject| F[Reject Button]
    D -->|Pause| G[Pause Button]
    D -->|Edit| H[Edit Button]
    D -->|Delete| I[Delete Button]
    D -->|Set Expiry| J[Set Expiry Dropdown]
    D -->|Check Expired| K[Check Expired Button]
    
    E --> L[Show Loader]
    F --> L
    G --> L
    H --> M[Show Edit Form]
    I --> N[Confirm Delete]
    J --> O[Select Time: 1/5/10/30 min]
    K --> L
    
    M --> P[Update Form]
    P --> Q[Save Changes]
    Q --> L
    
    O --> L
    N --> L
    
    L --> R[API Call]
    R --> S[Update Table]
    S --> C
    
    style A fill:#fff4e6
    style L fill:#e1f5ff
    style S fill:#c8e6c9
```

## Component Rendering Flow

```mermaid
graph TD
    A[App Loads] --> B[Root Layout]
    B --> C[ThemeInitializer]
    C --> D[Load Theme from Store]
    D --> E[Apply Theme to HTML]
    
    B --> F[Layout Component]
    F --> G{Check Auth State}
    
    G -->|Authenticated| H[Show Navigation]
    G -->|Not Authenticated| I[Show Login Links]
    
    H --> J[Render Page Content]
    I --> J
    
    J --> K[Page Component]
    K --> L[Fetch Data]
    L --> M[Show Global Loader]
    M --> N[API Call]
    N --> O[Hide Loader]
    O --> P[Render Data]
    
    P --> Q[User Interactions]
    Q --> R[Update State]
    R --> P
    
    style A fill:#e1f5ff
    style M fill:#fff4e6
    style P fill:#c8e6c9
```

## Validity Formatting Flow

```mermaid
flowchart TD
    A[API Returns Pack Data] --> B[Extract validityMonths]
    B --> C[formatValidity Function]
    
    C --> D{Calculate Years & Months}
    D --> E[Years = Math.floor months / 12]
    D --> F[RemainingMonths = months % 12]
    
    E --> G{Years > 0?}
    F --> H{Months > 0?}
    
    G -->|Yes| I[Add 'X year' or 'X years']
    G -->|No| J[Skip years]
    
    H -->|Yes| K[Add 'X month' or 'X months']
    H -->|No| L[Skip months]
    
    I --> M[Combine Parts]
    J --> M
    K --> M
    L --> M
    
    M --> N[Return Formatted String]
    N --> O[Display in UI]
    
    style A fill:#e1f5ff
    style N fill:#c8e6c9
    style O fill:#c8e6c9
```

## Complete Customer User Journey

```mermaid
journey
    title Customer Frontend Journey
    section Home Page
      Visit Home Page: 5: Customer
      See Theme Toggle: 4: Customer
      Select Theme: 5: Customer
      Click Customer Portal: 4: Customer
    section Registration/Login
      Go to Login/Signup: 4: Customer
      Enter Credentials: 3: Customer
      Submit Form: 4: Customer
      See Global Loader: 5: Customer
      Authenticate: 5: System
      Redirect to Dashboard: 5: Customer
    section Dashboard
      View Dashboard: 5: Customer
      See Current Subscription: 4: Customer
      View Formatted Validity: 5: Customer
      Navigate to Subscription Page: 4: Customer
    section Subscription Management
      View Available Packs: 5: Customer
      See Formatted Validity: 5: Customer
      Select Pack: 4: Customer
      Submit Request: 4: Customer
      See Success Message: 5: Customer
    section History
      View Subscription History: 4: Customer
      See Past Subscriptions: 4: Customer
      Navigate Back: 3: Customer
```

## Error Handling Flow

```mermaid
flowchart TD
    A[API Request Made] --> B{Response Status}
    
    B -->|200 OK| C[Process Success Response]
    B -->|401 Unauthorized| D[Token Invalid/Expired]
    B -->|404 Not Found| E[Resource Not Found]
    B -->|400 Bad Request| F[Validation Error]
    B -->|500 Server Error| G[Server Error]
    
    D --> H[Clear Token from localStorage]
    H --> I[Clear Zustand Store]
    I --> J{Current Page?}
    
    J -->|Login/Signup| K[Show Error Message]
    J -->|Other Pages| L[Redirect to Home]
    
    E --> M[Show 'Not Found' Message]
    F --> N[Show Validation Error]
    G --> O[Show Server Error Message]
    
    C --> P[Update UI]
    K --> Q[User Sees Error]
    L --> Q
    M --> Q
    N --> Q
    O --> Q
    
    style A fill:#e1f5ff
    style C fill:#c8e6c9
    style D fill:#ffcdd2
    style E fill:#ffcdd2
    style F fill:#ffcdd2
    style G fill:#ffcdd2
```

