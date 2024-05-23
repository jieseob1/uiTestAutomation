@conflict-insertion-deletion
Feature: Conflict Insertion Deletion

@conflict-insertion-deletion
  Scenario: One user inserts a sentence and another user deletes it
    Given "User A" and "User B" have opened the same document
    When "User A" inserts a new sentence in the document
    And "User B" deletes the sentence inserted by "User A"
    Then The changes should be merged correctly
    And Both "User A" and "User B" should see the same document content