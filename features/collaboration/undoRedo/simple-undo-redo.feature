@simple-undo-redo
Feature: simple undo redo test in collaboration

  @simple-undo-redo
    Scenario: Verify undo and redo functionality in collaborative editing
      Given "User A" and "User B" have opened the same document
      When "User A" types "Hello, World!"
      And "User B" sees the "Hello, World!" made by "User A"
      And "User A" undo their changes
      Then "User B" text should different with "Hello, World!"
      When "User A" redo their changes
      Then "User B" should see the text "Hello, World!"
