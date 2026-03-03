import React from "react";

export default function Faqs() {
  return (
    <div
      style={{
        color: "white",
        width: "80vw",
        height: "80vh",
        overflow: "auto",
      }}
    >
      <h1>Frequently Asked Questions</h1>
      <p>
        Here you can find answers to common questions about our Post-it
        application.
      </p>

      <h2>How do I create a new Post-it note?</h2>
      <p>
        To create a new Post-it note, click on the "Create PostIt" button located
        at the top right corner of the dashboard. Fill in the title,
        description, and priority, then click "Save".
      </p>

      <h2>Can I edit an existing Post-it note?</h2>
      <p>
        Yes! To edit a Post-it note, simply double-click on the postIt you wish to
        edit. This will open an edit modal where you can update the title,
        description, and priority. After making your changes, click "Save" to
        update the postIt.
      </p>

      <h2>How do I delete a Post-it note?</h2>
      <p>
        To delete a Post-it note, click on the delete icon (trash can) located
        on the postIt. A confirmation prompt will appear; click "Yes" to confirm
        the deletion.
      </p>

      <h2>Can I mark a Post-it note as in progress?</h2>
      <p>
        Yes! To mark a Post-it note as in progress, click on the "In Progress"
        button located on the postIt. This will move the postIt to the "In Progress"
        section of your dashboard.
      </p>

      <h2>How do I view completed Post-it notes?</h2>
      <p>
        To view completed Post-it notes, navigate to the "Archive" section of
        your dashboard. Here you will find all the postIts that have been marked
        as completed.
      </p>

      <h2>Can I search for specific Post-it notes?</h2>
      <p>
        Yes! Use the search bar at the top of the dashboard to search for
        specific Post-it notes by title, description, or tags.
      </p>

      <h2>How do I change the priority of a Post-it note?</h2>
      <p>
        To change the priority of a Post-it note, click on the postIt to open the
        edit modal. In the modal, you can select a new priority from the
        dropdown menu. After selecting the new priority, click "Save" to update
        the postIt.
      </p>

      <h2>Is there a way to organize my Post-it notes?</h2>
      <p>
        Yes! You can organize your Post-it notes by using tags. When creating or
        editing a postIt, you can add tags to categorize your postIts. You can then
        filter your postIts by tags to easily find related postIts.
      </p>

      <h2>How do I contact support if I have more questions?</h2>
      <p>
        If you have any further questions or need assistance, please contact our
        support team at
      </p>

      <h2>Can I add tags that do not remain in the description?</h2>
      <p>Yes, just add ~ at the end of the word.</p>

      <h2>Can I add use keyboard shortcuts?</h2>
      <p>Yes</p>
      <ul style={{ marginLeft: "1.5rem", listStyleType: "disc" }}>
        <li>
          <strong>Ctrl + .</strong> (or Cmd + . on Mac) to open the create postIt
          modal.
        </li>
        <li>
          <strong>Ctrl + /</strong> (or Cmd + / on Mac) to close the create postIt
          modal.
        </li>
      </ul>
    </div>
  );
}
