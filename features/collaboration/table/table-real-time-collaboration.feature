@table-real-time
Feature: Table Editing in real-time

  @table-real-time
  Scenario: Table row and column modifications synchronized in real-time
    Given "User A" and "User B" have opened the same document in same table
    When "User A" create column 5 row 3 a new table
    When "User A" write "Text wrote down by User A" at the row 1 column 1 and "User B" write "Text wrote down by User B" at the row 1 column 2 at the same time
    Then "User B" should see the "Text wrote down by User A" at the row 1 column 1 and "User A" should see the "Text wrote down by User B" at the row 1 column 2
    