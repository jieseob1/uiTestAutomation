Feature: Document Collaboration

  Scenario: Two users simultaneously editing different parts of the document
    Given "User A" and "User B" have opened the same document
    When "User A" types "Collaborative document editing facilitates seamless communication among team members." in the first paragraph
    And "User B" types "Real-time synchronization of changes enables efficient workflow." in the second paragraph
    Then The changes made by both users should be reflected on the screens of "User A" and "User B"