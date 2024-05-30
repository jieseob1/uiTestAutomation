@multiple-users-undo-redo
Feature: multiple users undo redo test in collaboration

  @multiple-users-undo-redo
  Scenario: Multiple users performing undo and redo actions
    Given "User A", "User B", and "User C" have opened the same document in multiple users undo redo steps
    When "User A" types "Hello, " in multiple users undo redo steps
    And "User B" types "World! " in multiple users undo redo steps
    And "User C" types "This is a test." in multiple users undo redo steps
    And "User A" undoes their changes in multiple users undo redo steps
    And "User B" undoes their changes in multiple users undo redo steps
    When "User A" redoes their changes in multiple users undo redo steps
    And "User B" redoes their changes in multiple users undo redo steps
    Then "User C" should see the text after User B redo "Hello, World! " in multiple users undo redo steps
    And "User C" undo their changes in multiple users undo redo steps
    Then "User C" should see the text after User C redo "Hello, World! This is a test" in multiple users undo redo steps