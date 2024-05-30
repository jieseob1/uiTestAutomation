@simple-undo-redo
Feature: simple undo redo test in collaboration

  @simple-undo-redo
    Scenario: Verify undo and redo functionality in collaborative editing
      Given "User A" and "User B" have opened the same document in simple undo redo steps
      When "User A" types "Hello, World!" in simple undo redo steps
      And "User B" sees the "Hello, World!" made by "User A" in simple undo redo steps
      And "User A" undo their changes in simple undo redo steps
      Then "User B" text should different with "Hello, World!" in simple undo redo steps
      When "User A" redo their changes in simple undo redo steps
      Then "User B" should see the text "Hello, World!" in simple undo redo steps
