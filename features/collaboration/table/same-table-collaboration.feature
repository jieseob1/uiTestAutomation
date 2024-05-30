@same-table-editing
Feature: Same Table Editing in collaborative

  @same-table-editing
  Scenario: Two users editing the same table simultaneously
    Given "User A" and "User B" have opened the same document in same table collaboration steps
    When "User A" creates column 5 row 3 a new table in same table collaboration steps
    And "User A" selects first cell and write "Content A" in same table collaboration steps
    And "User B" selects second cell in the same table and write "Content B" in same table collaboration steps
    Then The table should be merged correctly with both "Content A" and "Content B" in same table collaboration steps
    
