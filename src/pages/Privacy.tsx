const Privacy = () => {
  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-3xl mx-auto vintage-card rounded-sm p-6 sm:p-8 space-y-5">
        <h1 className="font-serif text-3xl">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: March 1, 2026</p>

        <section className="space-y-2">
          <h2 className="font-serif text-xl">Information We Collect</h2>
          <p>
            We collect RSVP and invitation details you provide, such as name, phone number, email, attendance
            response, guest count, and travel-related notes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl">How We Use Information</h2>
          <p>
            We use this information only to manage wedding invitations, send RSVP links and updates, and organize the
            event.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl">SMS Messaging</h2>
          <p>
            If you provide consent to receive text messages, message frequency varies based on RSVP reminders and event
            updates. Message and data rates may apply.
          </p>
          <p>You can opt out at any time by replying STOP. Reply HELP for support.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl">Data Sharing</h2>
          <p>
            We do not sell your personal information. We do not share your personal information with third parties for
            their marketing purposes.
          </p>
          <p>
            We only use service providers required to operate this invitation system (for example, SMS delivery and
            hosting).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl">Contact</h2>
          <p>For privacy questions, contact the event hosts directly.</p>
        </section>
      </div>
    </main>
  );
};

export default Privacy;
