@multiple-users-undo-redo
Feature: multiple users undo redo test in collaboration

  @multiple-users-undo-redo
  Scenario: Multiple users performing undo and redo actions
    Given "User A", "User B", and "User C" have opened the same document
    When "User A" types "Hello, "
    And "User B" types "World! "
    And "User C" types "This is a test."
    And "User A" undoes their changes
    And "User B" undoes their changes
    When "User A" redoes their changes
    And "User B" redoes their changes
    Then "User C" should see the text after User B redo "Hello, World! "
    And "User C" undo their changes
    Then "User C" should see the text after User C redo "Hello, World! This is a test"