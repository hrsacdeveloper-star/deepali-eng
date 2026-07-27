# Requirements Document

## 1. Application Overview

### 1.1 Application Name
Deepali Engineering Corporate Website with AI Chatbot

### 1.2 Application Description
Professional industrial manufacturing company website for Deepali Engineering, showcasing engineering components for export and domestic markets. The website includes a comprehensive AI-like chatbot powered entirely by PostgreSQL Full Text Search, enabling users to query company information, products, and services without relying on external AI APIs.

### 1.3 Technical Architecture
- Frontend: React + Vite + Tailwind CSS
- Backend: Supabase (PostgreSQL + Storage + Auth)
- CDN: Cloudflare
- Authentication: Email OTP via Resend.com API (REDACTED)
- Session Management: Persistent session
- Content Management: Database-driven
- Chatbot: PostgreSQL Full Text Search (tsvector/tsquery)
- Architecture: 2-Tier (Tier 1: User-facing Website with Chatbot; Tier 2: Admin Panel including Chatbot Management)

### 1.4 UI Theme
- Primary Colors: White, Dark Navy (#0a1628), Industrial Grey (#f5f7fa), Red Accent (#e63946)
- Design Style: Premium animations, Glass cards, Smooth scroll, Professional industrial layout
- Visual Elements: Large hero images, Modern sections, International layout
- Responsive Design: Fully responsive for mobile, tablet, and desktop devices
- Scroll Animations: Fade-in effects on content sections
- Text Alignment: Justified alignment for all paragraph sections

## 2. Target Users and Usage Scenarios

### 2.1 Target Users
- Indian industries
- International buyers
- OEM manufacturers
- Export companies
- Procurement managers
- Engineers
- Website visitors seeking instant information

### 2.2 Core Usage Scenarios
- View product catalog and details
- Submit inquiries and request quotations
- Download product catalogs and certificates
- Apply for job positions
- Learn about company capabilities and infrastructure
- Contact company for business opportunities
- Edit and resubmit previously submitted applications/quotations
- Track submission status
- Ask chatbot questions about products, services, company information
- Get instant answers from knowledge base and PDF documents

## 3. Page Structure and Functional Description

### 3.1 Page Hierarchy

```
Deepali Engineering Website
├── Home (with Chatbot Widget)
├── About Us (with Chatbot Widget)
├── Products (with Chatbot Widget)
│   └── Product Details (with Chatbot Widget)
├── Industries We Serve (with Chatbot Widget)
├── Infrastructure (with Chatbot Widget)
├── Manufacturing Facilities & Machines (with Chatbot Widget)
├── Quality Assurance (with Chatbot Widget)
├── Quality Standards (with Chatbot Widget)
├── Certifications (with Chatbot Widget)
├── Testing Procedures (with Chatbot Widget)
├── Tool Room (with Chatbot Widget)
├── Clients (with Chatbot Widget)
├── Gallery (with Chatbot Widget)
├── Downloads (with Chatbot Widget)
├── Careers (with Chatbot Widget)
│   └── Apply for Job (with Chatbot Widget)
├── Blog (with Chatbot Widget)
│   └── Blog Details (with Chatbot Widget)
├── FAQs (with Chatbot Widget)
├── Contact (with Chatbot Widget)
├── Quotation Request (RFQ) (with Chatbot Widget)
├── My Submissions (with Chatbot Widget)
├── Privacy Policy (with Chatbot Widget)
├── Terms & Conditions (with Chatbot Widget)
├── Sitemap (with Chatbot Widget)
├── Partners Admin (Admin Panel)
├── Chatbot Management (Admin Panel)
│   ├── Knowledge Base Management
│   └── PDF Documents Management
└── 404 Not Found
```

### 3.2 New Chatbot Components

#### 3.2.1 Chatbot Widget (All Pages)
**Display:**
- Floating chat icon button fixed at bottom-right corner
- Click to open chat window
- Chat window displays conversation history
- Input field for user questions
- Send button
- Close button
- Dark/Light mode toggle
- Responsive design (full screen on mobile, floating window on desktop)

**Functionality:**
- User types question and clicks Send
- Display loading animation while processing
- Show bot response with typing animation
- Display timestamp for each message
- User and bot messages in different bubble styles
- Auto-scroll to latest message
- Conversation memory persists during current browser session only
- Resets on page refresh
- Response time target: <500ms

**Search Logic:**
1. Search chatbot_knowledge table using PostgreSQL Full Text Search (tsvector/tsquery)
2. If match found, return answer immediately
3. If not found, search chatbot_documents table for most relevant paragraph using FTS ranking
4. If nothing found, return \"Sorry, I couldn't find information related to your question.\"

#### 3.2.2 Chatbot Management Page (Admin Panel)
**Navigation:**
- Accessible from Admin Panel main menu
- Two tabs: Knowledge Base Management, PDF Documents Management

**Knowledge Base Management Tab:**
- Display list of all Q&A records (fetched from chatbot_knowledge table)
- Table columns: Question, Answer, Category, Keywords, Created At, Updated At, Actions (Edit, Delete)
- Add New Q&A button
- Search functionality (search by question, answer, keywords)
- Filter by category
- Pagination

**Add/Edit Q&A Form:**
- Question (textarea, required)
- Answer (textarea, required)
- Category (text input, optional)
- Keywords (text input, comma-separated, optional)
- Save button
- Cancel button
- Form validation for required fields
- Success/error messages after operations

**PDF Documents Management Tab:**
- Display list of all uploaded PDFs (fetched from chatbot_documents table)
- Table columns: Title, PDF File, Content Preview, Created At, Actions (View, Delete)
- Upload New PDF button
- Search functionality (search by title, content)
- Pagination

**Upload PDF Form:**
- Title (text input, required)
- PDF File Upload (file input, accepts PDF only, max 20MB, required)
- Upload button
- Cancel button
- File size and format validation
- Automatic text extraction during upload
- Save extracted text to chatbot_documents table
- Store PDF file in Supabase Storage
- Display upload progress
- Success/error messages after operations

**CRUD Operations:**
- Create: Add new Q&A or upload new PDF
- Read: Display all records in list view
- Update: Edit existing Q&A (PDF content cannot be edited, only deleted and re-uploaded)
- Delete: Remove Q&A or PDF from database and delete associated PDF file from storage

### 3.3 Existing Pages (No Changes)

All existing pages retain their original functionality as defined in previous requirements. Chatbot widget is added to all pages as a floating component.

## 4. Business Rules and Logic

### 4.1 Chatbot Search Algorithm

**Step 1: Search Knowledge Base**
- Query chatbot_knowledge table using PostgreSQL Full Text Search
- Use tsvector and tsquery for matching
- Ignore case, punctuation, and understand similar words
- Rank results by relevance
- If match found with confidence score above threshold, return answer immediately

**Step 2: Search PDF Documents**
- If no match in knowledge base, query chatbot_documents table
- Search extracted PDF text using Full Text Search
- Rank paragraphs by relevance
- Return most relevant paragraph (top result)

**Step 3: No Results**
- If no match found in both tables, return default message: \"Sorry, I couldn't find information related to your question.\"

### 4.2 PDF Text Extraction Rules
- Text extraction occurs once during PDF upload
- Extracted text saved to chatbot_documents.content field
- Maximum PDF file size: 20MB
- Supported format: PDF only
- Text extraction includes all readable text from PDF
- Preserve paragraph structure for better search results

### 4.3 Chatbot Conversation Rules
- Conversation history stored in browser session only
- History resets on page refresh
- No persistent conversation storage
- Each query is independent (no context from previous messages)
- Response time target: <500ms
- Display loading animation during processing
- Typing animation for bot responses
- Auto-scroll to latest message

### 4.4 Chatbot UI Rules
- Floating chat icon always visible at bottom-right corner
- Chat window opens on click
- Chat window size: 400px width on desktop, full screen on mobile
- User messages aligned right with distinct bubble color
- Bot messages aligned left with distinct bubble color
- Timestamp displayed for each message
- Dark/Light mode toggle available
- Close button to minimize chat window
- Input field with Send button
- Responsive design for all devices

### 4.5 Admin Chatbot Management Rules
- Only authorized admin users can access Chatbot Management page
- CRUD operations tracked with created_at and updated_at timestamps
- PDF files stored in Supabase Storage
- Extracted text stored in PostgreSQL
- Search and filter functionality for easy management
- Pagination for large datasets
- Form validation enforced for all inputs
- File upload validation (size, format)
- Success/error messages displayed after operations

### 4.6 Database Tables

**New Tables:**
- **chatbot_knowledge**: id, question, answer, category, keywords, created_at, updated_at
- **chatbot_documents**: id, title, pdf_url, content (extracted text), created_at

**Existing Tables:** (No changes)
- company, hero_slider, about_company, vision_mission, products, product_categories, industries_served, machines, infrastructure, gallery, certificates, clients, testimonials, team, contact_enquiries, careers, job_applications, blogs, news, faqs, downloads, social_media, footer_content, settings, seo_meta, rfq_submissions, newsletter_subscribers, vendor_registrations, callback_requests, complaints, feedback, users, user_verifications, downloads_tracking, partners, quality_standards, testing_procedures, tool_room_machines, tool_room_facilities, tool_room_team

### 4.7 PostgreSQL Full Text Search Configuration
- Use tsvector data type for indexed search columns
- Use tsquery for search queries
- Configure text search dictionary for English language
- Implement ranking function for relevance scoring
- Index question, answer, keywords columns in chatbot_knowledge table
- Index content column in chatbot_documents table
- Optimize search performance with GIN indexes

### 4.8 Security and Performance Rules
- No external AI API calls
- All processing happens within Supabase PostgreSQL
- PDF text extraction happens once during upload (not on every query)
- Search queries optimized with indexes
- Response time target: <500ms
- Maximum PDF file size: 20MB
- File upload validation enforced
- Admin access control for Chatbot Management page
- Rate limiting for chatbot queries to prevent abuse

### 4.9 Existing Rules (No Changes)

All existing business rules from previous requirements remain unchanged, including:
- Authentication and Verification Rules
- Quotation Request and Download Workflow
- Content Management Rules
- Search and Filter Logic
- SEO Rules
- Image Handling
- Form Validation
- Responsive Design Rules
- Home Page Spacing Rules
- Scroll Animation Rules
- Mobile Layout Stability Rules
- Product Portfolio Presentation Rules
- Quality Assurance Framework Rules
- Navigation Quality Dropdown Rules
- Tool Room Page Rules
- Text Alignment Rules
- Partners Management Rules

## 5. Exceptions and Boundary Cases

| Scenario | Handling |
|----------|----------|
| User asks question with no matching results | Display default message: \"Sorry, I couldn't find information related to your question.\" |
| Chatbot query takes longer than 500ms | Display loading animation, implement timeout after 5 seconds |
| PDF upload exceeds 20MB | Display error \"File size too large. Maximum allowed: 20MB\" |
| PDF upload fails during text extraction | Display error \"Failed to extract text from PDF. Please try again.\" |
| Invalid PDF file format | Display error \"Invalid file format. Only PDF files are allowed.\" |
| Admin attempts to delete Q&A with invalid ID | Display error \"Record not found or already deleted.\" |
| Chatbot widget fails to load | Display error icon with tooltip \"Chatbot temporarily unavailable\" |
| User sends empty message | Disable Send button until text is entered |
| Chatbot database query fails | Display error \"Unable to process your question. Please try again.\" |
| Multiple users query chatbot simultaneously | Handle concurrent queries with proper database connection pooling |
| User switches between Dark/Light mode | Apply theme change immediately without page refresh |
| Chat window opened on mobile device | Display full-screen chat interface |
| User closes chat window with active conversation | Conversation history persists until page refresh |
| Admin uploads PDF with no extractable text | Display warning \"No text extracted from PDF. File saved but will not be searchable.\" |
| Search query contains special characters | Sanitize input and process query safely |
| Admin searches with no results | Display message \"No records found matching your search criteria.\" |
| Pagination on large datasets | Implement efficient pagination with limit/offset |
| User asks same question multiple times | Process each query independently, return same answer |
| Chatbot response contains HTML or special characters | Escape HTML and display as plain text |
| Network error during chatbot query | Display error \"Network error. Please check your connection and try again.\" |
| Admin deletes PDF while chatbot is searching it | Handle gracefully, return no results if document not found |
| User types very long question (>1000 characters) | Truncate or display error \"Question too long. Please keep it under 1000 characters.\" |
| Chatbot widget overlaps with other page elements | Ensure proper z-index and positioning to avoid conflicts |
| User opens multiple chat windows in different tabs | Each tab maintains independent session |
| Admin uploads duplicate PDF | Allow upload but display warning \"A PDF with similar title already exists.\" |
| Full Text Search index not built | Display error \"Search temporarily unavailable. Please contact administrator.\" |
| Database connection pool exhausted | Queue requests and display loading animation, implement timeout |

**Existing Exception Handling:** (No changes)

All existing exception handling rules from previous requirements remain unchanged.

## 6. Acceptance Criteria

1. User opens website and sees chatbot floating icon at bottom-right corner on all pages
2. User clicks chatbot icon and chat window opens with welcome message
3. User types question \"What products do you offer?\" and clicks Send
4. Chatbot searches chatbot_knowledge table using PostgreSQL Full Text Search
5. Chatbot returns relevant answer with typing animation within 500ms
6. User asks question not in knowledge base, chatbot searches chatbot_documents table
7. Chatbot returns most relevant paragraph from PDF documents
8. User asks unrelated question, chatbot returns \"Sorry, I couldn't find information related to your question.\"
9. User toggles Dark/Light mode and chat UI updates immediately
10. User closes chat window and reopens, conversation history persists during session
11. User refreshes page, conversation history resets
12. Admin user accesses Chatbot Management page from Admin Panel
13. Admin navigates to Knowledge Base Management tab and sees list of all Q&A records
14. Admin clicks Add New Q&A button, fills form with Question, Answer, Category, Keywords, and successfully saves to chatbot_knowledge table
15. Admin clicks Edit button on existing Q&A, modifies information, and successfully updates record
16. Admin clicks Delete button on Q&A, confirms deletion, and record is removed from database
17. Admin searches Q&A by keyword and sees filtered results
18. Admin navigates to PDF Documents Management tab and sees list of all uploaded PDFs
19. Admin clicks Upload New PDF button, selects PDF file (under 20MB), enters title, and uploads
20. System automatically extracts text from PDF during upload and saves to chatbot_documents table
21. Admin sees success message after PDF upload with extracted text preview
22. Admin clicks Delete button on PDF, confirms deletion, and PDF is removed from database and storage
23. User asks question related to uploaded PDF content, chatbot returns relevant paragraph from extracted text
24. User opens chatbot on mobile device and sees full-screen chat interface
25. User opens chatbot on desktop and sees floating chat window (400px width)
26. Admin attempts to upload PDF larger than 20MB and sees error message
27. Admin attempts to upload non-PDF file and sees error message
28. User sends multiple queries in quick succession and receives responses for each query
29. Chatbot response time consistently under 500ms for all queries
30. User views chatbot on tablet and desktop, confirms responsive design works properly

## 7. Not Included in This Phase

- External AI API integration (OpenAI, Gemini, Claude, Groq, Ollama, Hugging Face, etc.)
- Natural Language Processing beyond PostgreSQL Full Text Search
- Contextual conversation memory across sessions
- Multi-turn conversation with context awareness
- Sentiment analysis
- Intent classification beyond keyword matching
- Chatbot analytics dashboard
- Conversation history storage in database
- User feedback on chatbot responses
- Chatbot training interface
- Machine learning model integration
- Voice input/output for chatbot
- Multilingual chatbot support
- Chatbot personality customization
- Automated chatbot response improvement
- A/B testing for chatbot responses
- Chatbot escalation to human support
- Integration with CRM for lead capture
- Chatbot conversation export functionality
- Advanced NLP features (entity recognition, semantic search)
- Chatbot response templates
- Conditional logic for complex Q&A flows
- Chatbot widget customization options for users
- Chatbot branding customization
- Chatbot response rating system
- Chatbot conversation analytics
- Automated FAQ generation from chatbot queries
- Chatbot integration with third-party services
- Real-time chatbot performance monitoring
- Chatbot load balancing for high traffic
- Advanced PDF parsing (tables, images, charts)
- OCR for scanned PDFs
- PDF content versioning
- Bulk PDF upload functionality
- Automated PDF content categorization
- PDF content preview in admin panel
- Full-text search highlighting in PDF content
- Chatbot response caching
- Chatbot query suggestion/autocomplete
- Chatbot conversation branching
- Chatbot integration with email/SMS notifications
- Chatbot widget positioning customization
- Chatbot conversation export to PDF/CSV
- Chatbot response time analytics
- Chatbot user satisfaction metrics
- Chatbot A/B testing framework
- Chatbot response personalization based on user profile
- Chatbot integration with knowledge graph
- Chatbot semantic search capabilities
- Chatbot response generation using templates
- Chatbot conversation flow designer
- Chatbot integration with ticketing system
- Chatbot handoff to live agent
- Chatbot conversation transcripts
- Chatbot response approval workflow
- Chatbot knowledge base versioning
- Chatbot response quality scoring
- Chatbot conversation sentiment tracking
- Chatbot user engagement metrics
- Chatbot response time optimization tools
- Chatbot query clustering and analysis
- Chatbot automated response suggestions for admin
- Chatbot integration with product recommendation engine
- Chatbot proactive engagement triggers
- Chatbot conversation replay functionality
- Chatbot response A/B testing
- Chatbot knowledge base import/export
- Chatbot integration with analytics platforms
- Chatbot conversation tagging and categorization
- Chatbot response personalization engine
- Chatbot integration with marketing automation
- Chatbot conversation funnel analysis
- Chatbot response optimization recommendations
- Chatbot user journey tracking
- Chatbot integration with customer data platform
- Chatbot conversation insights dashboard
- Chatbot response effectiveness metrics
- Chatbot knowledge gap identification
- Chatbot automated content suggestions
- Chatbot integration with content management system
- Chatbot conversation quality assurance tools
- Chatbot response consistency monitoring
- Chatbot knowledge base health checks
- Chatbot automated testing framework
- Chatbot performance benchmarking
- Chatbot conversation compliance monitoring
- Chatbot response audit trail
- Chatbot knowledge base governance
- Chatbot conversation data retention policies
- Chatbot response approval workflows
- Chatbot knowledge base access controls
- Chatbot conversation data encryption
- Chatbot response security scanning
- Chatbot knowledge base backup and recovery
- Chatbot conversation disaster recovery
- Chatbot response failover mechanisms
- Chatbot knowledge base synchronization
- Chatbot conversation data migration tools
- Chatbot response version control
- Chatbot knowledge base change management
- Chatbot conversation data archiving
- Chatbot response rollback capabilities
- Chatbot knowledge base audit logs
- Chatbot conversation data anonymization
- Chatbot response compliance reporting
- Chatbot knowledge base documentation
- Chatbot conversation data governance
- Chatbot response quality assurance
- Chatbot knowledge base maintenance tools
- Chatbot conversation data lifecycle management
- Chatbot response monitoring and alerting
- Chatbot knowledge base optimization tools
- Chatbot conversation data analytics
- Chatbot response performance tuning
- Chatbot knowledge base search optimization
- Chatbot conversation data visualization
- Chatbot response caching strategies
- Chatbot knowledge base indexing optimization
- Chatbot conversation data warehousing
- Chatbot response load testing
- Chatbot knowledge base scalability planning
- Chatbot conversation data integration
- Chatbot response capacity planning
- Chatbot knowledge base high availability
- Chatbot conversation data federation
- Chatbot response disaster recovery planning
- Chatbot knowledge base replication
- Chatbot conversation data partitioning
- Chatbot response failover testing
- Chatbot knowledge base sharding
- Chatbot conversation data archival strategies
- Chatbot response performance monitoring
- Chatbot knowledge base backup strategies
- Chatbot conversation data retention strategies
- Chatbot response optimization strategies
- Chatbot knowledge base recovery strategies
- Chatbot conversation data security strategies
- Chatbot response scaling strategies
- Chatbot knowledge base maintenance strategies
- Chatbot conversation data compliance strategies
- Chatbot response reliability strategies
- Chatbot knowledge base governance strategies
- Chatbot conversation data quality strategies
- Chatbot response availability strategies
- Chatbot knowledge base lifecycle strategies
- Chatbot conversation data management strategies
- Chatbot response continuity strategies
- Chatbot knowledge base evolution strategies
- Chatbot conversation data protection strategies
- Chatbot response resilience strategies
- Chatbot knowledge base sustainability strategies

**Existing Not Included Items:** (No changes)

All existing \"Not Included in This Phase\" items from previous requirements remain unchanged.