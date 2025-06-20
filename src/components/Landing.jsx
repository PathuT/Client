import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', color: '#1f2937' }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.2rem 2rem', background: '#ffffff', boxShadow: '0 1px 8px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{ color: '#4F46E5' }}>Agentic AI</h2>
        <div>
          <Link to="/login" style={{
            background: '#4F46E5',
            color: '#fff',
            padding: '0.6rem 1.2rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 600
          }}>
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '4rem 2rem',
        background: 'linear-gradient(90deg, #dfe9f3 0%, #ffffff 100%)',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem', color: '#111827' }}>
            AI Validation for OKR Submissions - Networking event
          </h1>
          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: '#4B5563' }}>
            Empowering institutions and learners to validate OKRs, certificates, and outcomes using multi-agent AI.
          </p>
          <Link to="/Submission" style={{
            background: '#4F46E5',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            marginRight: '1rem'
          }}>
            Get Started
          </Link>
          <a href="#features" style={{ color: '#4F46E5', fontWeight: 'bold' }}>Learn More</a>
        </div>

      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '4rem 2rem', background: '#f9fafb', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', color: '#1f2937', marginBottom: '1rem' }}>
          Everything You Need for Authentic Submissions
        </h2>
        <p style={{ fontSize: '1.05rem', color: '#6b7280', maxWidth: '700px', margin: '0 auto 2rem' }}>
          A multi-agent system built with LangChain, Tavily, and Gemini Flash for validation, scoring, and source comparison.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          {[
            {
              title: 'Plagiarism Check',
              desc: 'Detects reused, AI-generated, or ghostwritten content with context-aware comparison.',
              bg: '#DCFCE7',
              icon: '🕵️‍♂️'
            },
            {
              title: 'Certificate OCR',
              desc: 'Extracts and verifies certificate or letter content using OCR + Google validation.',
              bg: '#E0F2FE',
              icon: '📄'
            },
            {
              title: 'Outcome Mapping',
              desc: 'Checks alignment of OKRs with actual project outcomes using LLM scoring.',
              bg: '#FEF3C7',
              icon: '🎯'
            },
            {
              title: 'Explainable Report',
              desc: 'Transparent logs and scoring to help improve future submissions.',
              bg: '#F3E8FF',
              icon: '📊'
            }
          ].map((card, i) => (
            <div key={i} style={{
              background: card.bg,
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'left',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{card.icon} {card.title}</h3>
              <p style={{ fontSize: '0.95rem', color: '#374151' }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#111827',
        color: '#d1d5db',
        textAlign: 'center',
        padding: '2rem',
        fontSize: '0.9rem',
        marginTop: '2rem'
      }}>
        © 2025 Agentic AI Validator. Built with ❤️ using LangChain + Gemini + Tavily.
      </footer>
    </div>
  );
};

export default Landing;
