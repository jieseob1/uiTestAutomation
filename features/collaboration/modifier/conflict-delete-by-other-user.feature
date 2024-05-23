@conflict-delete-by-other-user
Feature: Conflict resolution and merging during collaborative editing

  @conflict-delete-by-other-user
  Scenario: One User deletes a sentence containing another user's simultaneous changes
    Given "User A" and "User B" have opened the same document
    When "User A" and "User B" simultaneously edit the document where "User A" edits "This is the first sentence edited by User A." and "User B" deletes the entire sentence
    Then Both "User A" and "User B" should see the document content as: ""