import { useState } from 'react';
import InsuranceModal from '../components/InsuranceModal';
import { Badge } from 'finkargo-design-system/components/Badge/Badge';

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  navBg:        '#0C0E2C',
  primary:      '#1C1B66',
  primaryLight: '#2128B1',
  primaryLighter:'#596BCE',
  primaryUL:    '#D6DDF7',
  primary50:    '#F1F2FF',
  white:        '#FFFFFF',
  gray100:      '#F9FAFC',
  gray200:      '#E6E7F1',
  gray300:      '#A7A8C3',
  gray400:      '#6C6D8C',
  textPrimary:  '#393A55',
  textSecondary:'#4A4B6B',
  successDark:  '#03593A',
  successMain:  '#2CA14D',
  successLight: '#AAEAA8',
  successUL:    '#E0F7E6',
  bannerBg:     '#EFF6E8',
};

const FONT = '"Albert Sans", system-ui, sans-serif';

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar() {
  return (
    <aside style={{
      width: 64,
      minWidth: 64,
      background: C.navBg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px 0',
      gap: 8,
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 16 }}>
        <FKShieldLogo />
      </div>

      {/* Nav items */}
      <NavIcon active>
        <GridIcon />
      </NavIcon>
      <NavIcon>
        <FolderIcon />
      </NavIcon>
      <NavIcon>
        <PersonIcon />
      </NavIcon>
    </aside>
  );
}

function NavIcon({ children, active }) {
  return (
    <div style={{
      width: 40,
      height: 40,
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: active ? C.primaryLight : 'transparent',
      cursor: 'pointer',
    }}>
      {children}
    </div>
  );
}

// ─── Top Nav ─────────────────────────────────────────────────────────────────
function TopNav() {
  return (
    <header style={{
      height: 56,
      background: C.white,
      borderBottom: `1px solid ${C.gray200}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 24px',
      gap: 12,
    }}>
      <button style={{
        width: 32,
        height: 32,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        color: C.gray400,
      }}>
        <BellIcon />
      </button>
      <button style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        border: `1px solid ${C.gray200}`,
        background: C.white,
        borderRadius: 8,
        padding: '6px 12px',
        cursor: 'pointer',
        fontFamily: FONT,
        fontSize: 14,
        fontWeight: 500,
        color: C.textPrimary,
      }}>
        Nombre empresa
        <ChevronDownIcon />
      </button>
    </header>
  );
}

// ─── Stepper ─────────────────────────────────────────────────────────────────
const STEPS = [
  { label: 'En producción',        sub: 'Por definir',           done: true  },
  { label: 'Puerto de origen',     sub: 'ETD · Por definir',     done: false },
  { label: 'En tránsito marítimo', sub: 'Por definir',           done: false },
  { label: 'Puerto de destino',    sub: 'Descarga · Por definir',done: false },
  { label: 'En tránsito terrestre',sub: 'Por definir',           done: false },
  { label: 'Entregado',            sub: 'Por definir',           done: false },
];

function Stepper() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, padding: '24px 0 8px' }}>
      {STEPS.map((step, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          {/* Connector line before */}
          {i > 0 && (
            <div style={{
              position: 'absolute',
              top: 15,
              left: 0,
              width: '50%',
              height: 2,
              background: step.done ? C.successMain : C.gray200,
            }} />
          )}
          {/* Connector line after */}
          {i < STEPS.length - 1 && (
            <div style={{
              position: 'absolute',
              top: 15,
              left: '50%',
              width: '50%',
              height: 2,
              background: STEPS[i + 1]?.done ? C.successMain : C.gray200,
            }} />
          )}

          {/* Circle */}
          {step.done ? (
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: C.successMain,
              border: `2px solid ${C.successMain}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              position: 'relative',
            }}>
              <CheckIcon color={C.white} />
            </div>
          ) : (
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: C.white,
              border: `2px solid ${C.gray200}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              position: 'relative',
            }}>
              <FlagIcon color={C.gray300} />
            </div>
          )}

          {/* Labels */}
          <div style={{ marginTop: 8, textAlign: 'center', padding: '0 4px' }}>
            <p style={{
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: 600,
              color: step.done ? C.textPrimary : C.textPrimary,
              margin: 0,
              lineHeight: 1.3,
            }}>{step.label}</p>
            <p style={{
              fontFamily: FONT,
              fontSize: 11,
              color: C.gray400,
              margin: '2px 0 0',
              lineHeight: 1.3,
            }}>{step.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Insurance Banner ─────────────────────────────────────────────────────────
function InsuranceBanner({ onAccept, onDismiss }) {
  return (
    <div style={{
      background: C.bannerBg,
      borderRadius: 12,
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      margin: '16px 0',
    }}>
      {/* Icon */}
      <div style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        border: `2px solid ${C.gray300}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        background: C.white,
      }}>
        <InsuranceIcon />
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <p style={{
          fontFamily: FONT,
          fontSize: 15,
          fontWeight: 600,
          color: C.primary,
          margin: 0,
          lineHeight: 1.4,
        }}>
          Tu carga vale USD 45,000. Protégela desde USD 162.
        </p>
        <p style={{
          fontFamily: FONT,
          fontSize: 13,
          color: C.gray400,
          margin: '4px 0 0',
        }}>
          Sin deducible · 247 importadores ya protegieron su carga este mes.
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button
          onClick={onAccept}
          style={{
            height: 36,
            padding: '0 16px',
            borderRadius: 8,
            border: 'none',
            background: C.successDark,
            color: C.white,
            fontFamily: FONT,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Proteger mi carga
        </button>
        <button
          onClick={onDismiss}
          style={{
            height: 36,
            padding: '0 16px',
            borderRadius: 8,
            border: `1px solid ${C.gray300}`,
            background: 'transparent',
            color: C.gray400,
            fontFamily: FONT,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Ahora no
        </button>
      </div>
    </div>
  );
}

// ─── Insured Banner ───────────────────────────────────────────────────────────
function InsuredBanner() {
  return (
    <div style={{
      background: C.bannerBg,           // DS success.ultraLight
      borderRadius: 12,
      padding: '13px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      margin: '16px 0',
      border: `1.5px solid ${C.successLight}`,  // DS success.light
    }}>
      {/* Check icon — DS success.dark fill */}
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: C.successDark,      // DS success.dark
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M4 9L7.5 12.5L14 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Single-line text using DS success token colors */}
      <p style={{
        fontFamily: FONT, fontSize: 14, margin: 0, flex: 1,
        color: C.successDark,           // DS success.dark
        fontWeight: 500,
      }}>
        Mercancía asegurada
        <span style={{ fontWeight: 400, color: C.gray400 }}>
          {' '}·{' '}Cert. #VERT-2025-00847 · Vigente hasta 26 Oct 2025
        </span>
      </p>

      {/* Ver certificado — DS success.dark color */}
      <button style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        fontFamily: FONT, fontSize: 13, fontWeight: 600,
        color: C.successDark,           // DS success.dark
        display: 'flex', alignItems: 'center', gap: 4,
        flexShrink: 0, whiteSpace: 'nowrap',
      }}>
        Ver certificado →
      </button>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = ['Resumen', 'Documentos', 'Gestión de pagos'];

function TabBar({ active, onChange }) {
  return (
    <div style={{
      display: 'flex',
      borderBottom: `1px solid ${C.gray200}`,
      gap: 0,
    }}>
      {TABS.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            style={{
              padding: '12px 16px',
              border: 'none',
              background: 'transparent',
              fontFamily: FONT,
              fontSize: 14,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? C.primaryLight : C.gray400,
              borderBottom: isActive ? `2px solid ${C.primaryLight}` : '2px solid transparent',
              marginBottom: -1,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {tab === 'Resumen' && <ResumenTabIcon active={isActive} />}
            {tab === 'Documentos' && <DocumentTabIcon active={isActive} />}
            {tab === 'Gestión de pagos' && <PaymentTabIcon active={isActive} />}
            {tab}
          </button>
        );
      })}
    </div>
  );
}

// ─── Operaciones card ─────────────────────────────────────────────────────────
function OperacionesCard() {
  return (
    <div style={{
      background: C.white,
      borderRadius: 12,
      border: `1px solid ${C.gray200}`,
      padding: 24,
      flex: 1,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, color: C.textPrimary, margin: 0 }}>
          Operaciones
        </h3>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          background: 'transparent',
          border: 'none',
          fontFamily: FONT,
          fontSize: 13,
          color: C.primaryLight,
          cursor: 'pointer',
          fontWeight: 500,
        }}>
          Ir a mis operaciones
          <ExternalLinkIcon />
        </button>
      </div>

      {/* Empty state */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '32px 0',
        gap: 12,
      }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: C.gray100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <MoneyIcon />
        </div>
        <p style={{ fontFamily: FONT, fontSize: 14, color: C.gray400, margin: 0 }}>
          Solicita pagos a tus proveedores
        </p>
        <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'transparent', border: 'none',
            fontFamily: FONT, fontSize: 13, fontWeight: 500,
            color: C.primaryLight, cursor: 'pointer',
          }}>
            <span style={{ fontSize: 16 }}>+</span> Nueva Operación
          </button>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'transparent', border: 'none',
            fontFamily: FONT, fontSize: 13, fontWeight: 500,
            color: C.primaryLight, cursor: 'pointer',
          }}>
            <LinkIcon /> Asocia una operación
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Documentos card ──────────────────────────────────────────────────────────
const DOCS_BASE = [
  { name: 'BL Master.png',                   type: 'img',  tag: 'IMG',  cert: false },
  { name: 'Factura.PDF',                      type: 'pdf',  tag: 'PDF',  cert: false },
];
const DOC_CERT = { name: 'Protege_VERT-2025-00847.pdf', type: 'cert', tag: 'CERT', cert: true };

function DocumentosCard({ certAdded }) {
  const docs = certAdded ? [...DOCS_BASE, DOC_CERT] : DOCS_BASE;
  const counter = certAdded ? '4 de 4' : '3 de 4';

  return (
    <div style={{
      background: C.white,
      borderRadius: 12,
      border: `1px solid ${C.gray200}`,
      padding: 24,
      width: 320,
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, color: C.textPrimary, margin: 0 }}>
          Documentos
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            background: certAdded ? C.successDark : C.primaryLight,
            color: C.white,
            borderRadius: 12,
            padding: '2px 8px',
            fontSize: 12,
            fontFamily: FONT,
            fontWeight: 600,
            transition: 'background 0.3s ease',
          }}>{counter}</span>
          <button style={{
            width: 28, height: 28, borderRadius: 6,
            border: `1px solid ${C.gray200}`,
            background: C.white, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <DownloadIcon />
          </button>
        </div>
      </div>

      {/* Doc list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {docs.map((doc) => (
          <div key={doc.name} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px',
            borderRadius: 8,
            border: `1px solid ${doc.cert ? C.successLight : C.gray200}`,
            background: doc.cert ? C.bannerBg : C.white,
          }}>
            {/* Tag: DS Badge for CERT, plain chip for others */}
            {doc.cert ? (
              <Badge
                label="CERT"
                variant="success"
                size="small"
                badgeStyle="dark"
                border={true}
              />
            ) : (
              <div style={{
                width: 36, height: 36,
                borderRadius: 6,
                background: doc.type === 'pdf' ? '#FFF0F0' : '#F0F0FF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{
                  fontFamily: FONT, fontSize: 9, fontWeight: 700,
                  color: doc.type === 'pdf' ? '#CC071E' : C.primaryLight,
                  letterSpacing: '0.5px',
                }}>{doc.tag}</span>
              </div>
            )}
            <span style={{
              fontFamily: FONT, fontSize: 13,
              color: doc.cert ? C.successDark : C.textPrimary,
              fontWeight: doc.cert ? 500 : 400,
              flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {doc.name}
            </span>
            <button style={{
              background: 'transparent', border: 'none',
              cursor: 'pointer', color: C.gray300, fontSize: 18,
              display: 'flex', alignItems: 'center',
            }}>⋯</button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <button style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'transparent', border: 'none',
        fontFamily: FONT, fontSize: 13, fontWeight: 500,
        color: C.primaryLight, cursor: 'pointer',
        marginTop: 16,
      }}>
        Ver documentos →
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ImportacionDetalle() {
  const [activeTab, setActiveTab]     = useState('Resumen');
  const [bannerState, setBannerState] = useState('offer'); // 'offer' | 'dismissed' | 'insured'
  const [modalOpen, setModalOpen]     = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: FONT, overflow: 'hidden' }}>
      <Sidebar />

      {modalOpen ? (
        <InsuranceModal
          open={true}
          onClose={() => setModalOpen(false)}
          onEmit={() => setBannerState('insured')}
        />
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TopNav />

        <main style={{
          flex: 1,
          overflow: 'auto',
          background: C.gray100,
          padding: '0 32px 32px',
        }}>
          {/* Top action row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 0 8px',
          }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'transparent', border: 'none',
              fontFamily: FONT, fontSize: 14, fontWeight: 500,
              color: C.textSecondary, cursor: 'pointer',
            }}>
              <BackArrowIcon /> Volver
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontFamily: FONT, fontSize: 12, color: C.gray400,
                background: C.white, border: `1px solid ${C.gray200}`,
                borderRadius: 6, padding: '4px 10px',
              }}>
                Última actualización: 20 Ago 2025, 12:54 p.m.
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.successMain, display: 'inline-block' }} />
              </span>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: C.primary, color: C.white,
                border: 'none', borderRadius: 8,
                padding: '8px 16px',
                fontFamily: FONT, fontSize: 14, fontWeight: 500,
                cursor: 'pointer',
              }}>
                + Nueva operación
              </button>
            </div>
          </div>

          {/* Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <h1 style={{
              fontFamily: FONT,
              fontSize: 28,
              fontWeight: 700,
              color: C.primary,
              margin: 0,
              letterSpacing: '-0.5px',
            }}>
              #FAC-123456
            </h1>
            <span style={{
              background: C.gray200,
              color: C.gray400,
              borderRadius: 6,
              padding: '2px 8px',
              fontSize: 13,
              fontFamily: FONT,
            }}>–</span>
          </div>

          {/* Metadata row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20,
            fontFamily: FONT, fontSize: 13, color: C.gray400,
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShipIcon /> BL #EGLV142501045077
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CalendarIcon /> ETA 26 Abr 2025
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <UserIcon /> CHINA VIGOR DRILLING OIL TOOLS A...
            </span>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'transparent', border: 'none',
              fontFamily: FONT, fontSize: 13, fontWeight: 500,
              color: C.primaryLight, cursor: 'pointer',
            }}>
              Ver info <ExternalLinkIcon />
            </button>
          </div>

          {/* Tab bar */}
          <TabBar active={activeTab} onChange={setActiveTab} />

          {/* Tab content */}
          {activeTab === 'Resumen' && (
            <>
              {/* Stepper */}
              <div style={{
                background: C.white,
                borderRadius: 12,
                border: `1px solid ${C.gray200}`,
                padding: '8px 24px 24px',
                marginTop: 20,
              }}>
                <Stepper />
              </div>

              {/* Banner */}
              {bannerState === 'offer' && (
                <InsuranceBanner
                  onAccept={() => setModalOpen(true)}
                  onDismiss={() => setBannerState('dismissed')}
                />
              )}
              {bannerState === 'insured' && <InsuredBanner />}

              {/* Bottom grid */}
              <div style={{ display: 'flex', gap: 20, marginTop: 16 }}>
                <OperacionesCard />
                <DocumentosCard certAdded={bannerState === 'insured'} />
              </div>
            </>
          )}

          {activeTab === 'Documentos' && (
            <div style={{ marginTop: 20, fontFamily: FONT, color: C.gray400, fontSize: 14 }}>
              Vista de documentos
            </div>
          )}

          {activeTab === 'Gestión de pagos' && (
            <div style={{ marginTop: 20, fontFamily: FONT, color: C.gray400, fontSize: 14 }}>
              Vista de gestión de pagos
            </div>
          )}
        </main>
      </div>
      )}
    </div>
  );
}

// ─── SVG Icon components ──────────────────────────────────────────────────────

function FKShieldLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="8" fill="rgba(255,255,255,0.1)" />
      <path d="M18 7L27 11V19C27 23.9 23 28.1 18 29C13 28.1 9 23.9 9 19V11L18 7Z"
            fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      <text x="18" y="22" textAnchor="middle" fill="white"
            fontSize="8" fontWeight="700" fontFamily={FONT}>FK</text>
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white" />
      <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" />
      <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" />
      <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M2 5.5C2 4.67 2.67 4 3.5 4H7L9 6H14.5C15.33 6 16 6.67 16 7.5V13.5C16 14.33 15.33 15 14.5 15H3.5C2.67 15 2 14.33 2 13.5V5.5Z"
            stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="6" r="3" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
      <path d="M3 15c0-3.31 2.69-6 6-6s6 2.69 6 6"
            stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2C6.24 2 4 4.24 4 7v4l-1 2h12l-1-2V7c0-2.76-2.24-5-5-5z"
            stroke={C.gray400} strokeWidth="1.5" fill="none" />
      <path d="M7.5 15c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5"
            stroke={C.gray400} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 5l4 4 4-4" stroke={C.gray400} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2.5 7L5.5 10L11.5 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FlagIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 2v10M3 2h7l-2 3 2 3H3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InsuranceIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 3L19 7V12C19 16.4 15.4 20.2 11 21C6.6 20.2 3 16.4 3 12V7L11 3Z"
            stroke={C.gray400} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <circle cx="11" cy="11" r="2.5" stroke={C.successDark} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function BackArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8l5 5" stroke={C.textSecondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M5 3H3.5C2.67 3 2 3.67 2 4.5v5C2 10.33 2.67 11 3.5 11h5C9.33 11 10 10.33 10 9.5V8M8 2h3v3M7 6l4-4"
            stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShipIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 9l1-4h8l1 4M4 5V3h6v2M7 9v3M1 12h12" stroke={C.gray300} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke={C.gray300} strokeWidth="1.2" fill="none" />
      <path d="M1.5 5.5h11M4.5 1.5v2M9.5 1.5v2" stroke={C.gray300} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="5" r="2.5" stroke={C.gray300} strokeWidth="1.2" fill="none" />
      <path d="M2 12c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke={C.gray300} strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function MoneyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
            stroke={C.gray300} strokeWidth="1.5" fill="none" />
      <path d="M12 6v2M12 16v2M9 8.5h4.5a1.5 1.5 0 010 3H10a1.5 1.5 0 000 3H15"
            stroke={C.gray300} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5.5 8.5a3 3 0 004.24 0l2-2a3 3 0 00-4.24-4.24l-1 1M8.5 5.5a3 3 0 00-4.24 0l-2 2a3 3 0 004.24 4.24l1-1"
            stroke={C.primaryLight} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 2v7M4 7l3 3 3-3M2 11h10" stroke={C.gray400} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ResumenTabIcon({ active }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke={active ? C.primaryLight : C.gray300} strokeWidth="1.3" />
      <path d="M4.5 7h5M7 4.5v5" stroke={active ? C.primaryLight : C.gray300} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function DocumentTabIcon({ active }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 2h6l2 2v8H3V2z" stroke={active ? C.primaryLight : C.gray300} strokeWidth="1.3" fill="none" />
      <path d="M5 6h4M5 8h3" stroke={active ? C.primaryLight : C.gray300} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function PaymentTabIcon({ active }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1.5" y="3.5" width="11" height="8" rx="1.5" stroke={active ? C.primaryLight : C.gray300} strokeWidth="1.3" fill="none" />
      <path d="M1.5 6.5h11" stroke={active ? C.primaryLight : C.gray300} strokeWidth="1.2" />
    </svg>
  );
}
