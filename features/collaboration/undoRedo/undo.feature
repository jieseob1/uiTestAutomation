@undo
Feature: undo

  @undo
  Scenario: One user undoes their changes, and it is reflected for other users
    Given "User A" and "User B" have opened the same document in undo steps
    When "User A" types "Real-time synchronization of changes by User A"
    And "User B" sees the "Real-time synchronization of changes by User A" made by "User A"
    And "User A" undoes their changes
    Then "User B" should not see the text "Real-time synchronization of changes by User A"
    