@conflict-delete-by-other-user
Feature: Conflict resolution and merging during collaborative editing

  @conflict-delete-by-other-user
  Scenario: One User partially deletes a sentence containing another user's changes
    Given "User A" and "User B" have opened the same document in conflict delete by other user steps
    When "User A" writes "This is the first sentence edited by User A." in conflict delete by other user steps
    And "User B" deletes the word "edited" in the sentence "This is the first sentence edited by User A." in conflict delete by other user steps
    Then Both "User A" and "User B" should see the document content as "This is the first sentence by User A." in conflict delete by other user steps
