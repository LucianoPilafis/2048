# E2E Test: One-Click Table Exports

Test table export and query results export functionality in the Natural Language SQL Interface application.

## User Story

As a data analyst
I want to export tables and query results as CSV files with a single click
So that I can easily share, archive, or further analyze my data in spreadsheet tools

## Test Steps

1. Navigate to the `Application URL`
2. Take a screenshot of the initial state
3. **Verify** the page title is "Natural Language SQL Interface"
4. **Verify** core UI elements are present:
   - Query input textbox
   - Query button
   - Upload Data button
   - Available Tables section

5. Upload sample data (users) to ensure a table exists
6. Wait for the table to appear in Available Tables section
7. Take a screenshot showing the uploaded table
8. **Verify** a download button (with download icon) appears next to the × icon on the available table
9. Click the table download button
10. **Verify** a network request is made to `/api/export/table/users` with a 200 response
11. Take a screenshot after clicking the table download button

12. Enter the query: "Show me all users"
13. Click the Query button
14. Wait for query results to appear
15. Take a screenshot of the query results
16. **Verify** the results table contains data
17. **Verify** a download button appears next to the Hide button in the results section
18. Click the results download button
19. **Verify** a network request is made to `/api/export/results` with a 200 response
20. Take a screenshot after clicking the results download button

## Success Criteria
- Table upload succeeds and table appears in Available Tables
- Download button is visible next to the × icon for the table
- Clicking table download button triggers a request to the export endpoint
- Query results display correctly
- Download button is visible next to the Hide button in results
- Clicking results download button triggers a request to the export endpoint
- 5 screenshots are taken
