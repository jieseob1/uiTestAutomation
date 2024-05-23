@shape-edit-delete
Feature: shape editing and deleting synchronization

  @shape-edit-delete
  Scenario: Shape addition and deletion synchronized in real-time
    Given "User A" and "User B" have opened the same document
    When "User A" adds a new shape
    Then "User B" should see the new shape in real-time
    When "User A" deletes the shape
    Then "User B" should see the shape removed in real-time