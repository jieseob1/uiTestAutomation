@multi-user
Feature: Multi-user collaboration
  
  @multi-user
  Scenario: Five users editing different paragraphs simultaneously
    Given the following users Enter the DoucmentList:
      | User    |
      | User A  |
      | User B  |
      | User C  |
      | User D  |
      | User E  |
    When each user enters the document at 1-second intervals and edits a different paragraph
    Then all users should see the same screen with the changes made by each user