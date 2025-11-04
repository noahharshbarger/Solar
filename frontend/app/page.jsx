import Image from 'next/image';

export default function Home() {
  return (
    <main
      style={{
        backgroundImage: "url('/house.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'auto',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100vw',
      }}
      className="flex items-center justify-center"
    >
      <section className="relative w-full max-w-2xl mx-auto text-center py-16 px-6 rounded-xl shadow-2xl bg-gray-200">
        <div className="flex justify-center mb-8">
          <Image
            src="/ucandr-logo.png"
            alt="Unified Construction and Restoration Logo"
            width={180}
            height={140}
            style={{ objectFit: 'contain' }}
          />
        </div>
        <h1 className="text-6xl md:text-4xl font-bold text-[#08284f] mb-4">
          UCR Sales Portal
        </h1>
        <p className="text-base md:text-lg text-[#08284f] max-w-xl mx-auto mb-8">
          Welcome to the Sales Portal! Streamline part selection and ordering for your sales team with a professional, easy-to-use interface.
        </p>
        <a
          href="/parts-picker"
          className="inline-block bg-[#053e7f] text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-[#08284f] transition"
        >
          Get Started
        </a>
      </section>
    </main>
  );
}