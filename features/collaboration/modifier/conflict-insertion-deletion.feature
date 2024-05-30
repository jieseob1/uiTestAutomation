@conflict-insertion-deletion
Feature: confilict insertion and deletion in collaborative mode

  @conflict-insertion-deletion
  Scenario: One user inserts a word and another user deletes part of it simultaneously
    Given "User A" and "User B" have opened the same document in conflict insertion deleteion steps
    When "User A" writes "This is a new sentence." in conflict insertion deleteion steps
    And "User B" deletes the word "new" in the sentence "This is a new sentence." in conflict insertion deleteion steps
    Then Both "User A" and "User B" should see the document content as "This is a sentence." in conflict insertion deleteion steps