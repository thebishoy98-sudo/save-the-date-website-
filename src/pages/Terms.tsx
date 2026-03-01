const Terms = () => {
  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-3xl mx-auto vintage-card rounded-sm p-6 sm:p-8 space-y-5">
        <h1 className="font-serif text-3xl">Terms and Conditions</h1>
        <p className="text-sm text-muted-foreground">Last updated: March 1, 2026</p>

        <section className="space-y-2">
          <h2 className="font-serif text-xl">Use of This Site</h2>
          <p>
            This site is provided to manage wedding details and RSVP responses for invited guests. Please use the site
            only for invitation-related purposes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl">SMS Terms</h2>
          <p>
            By providing your phone number and consenting, you agree to receive wedding invitation and RSVP-related SMS
            messages.
          </p>
          <p>Message frequency varies. Message and data rates may apply.</p>
          <p>Reply STOP to opt out at any time. Reply HELP for support.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl">Consent</h2>
          <p>
            You confirm that the contact details you provide are accurate and that you are authorized to receive
            messages at that number.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl">Changes</h2>
          <p>We may update these terms as needed to support event operations and legal compliance.</p>
        </section>
      </div>
    </main>
  );
};

export default Terms;
