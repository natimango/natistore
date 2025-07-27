import Hero from '../components/Hero';
import Container from '../components/Container';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Container>
        <div className="my-12 text-center text-2xl font-heading">NATI scaffold ready</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="bg-gray-200 h-40 flex items-center justify-center rounded">Basics</div>
          <div className="bg-gray-200 h-40 flex items-center justify-center rounded">Art</div>
          <div className="bg-gray-200 h-40 flex items-center justify-center rounded">Collectibles</div>
        </div>
      </Container>
    </main>
  );
}
