import { useState, useEffect, useCallback } from 'react';

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  primary:       '#1C1B66',
  primaryLight:  '#2128B1',
  primaryUL:     '#D6DDF7',
  primary50:     '#F1F2FF',
  white:         '#FFFFFF',
  gray100:       '#F9FAFC',
  gray200:       '#E6E7F1',
  gray300:       '#A7A8C3',
  gray400:       '#6C6D8C',
  textPrimary:   '#393A55',
  textSecondary: '#4A4B6B',
  successDark:   '#03593A',
  successMain:   '#2CA14D',
  bannerBg:      '#EFF6E8',
  errorMain:     '#CC071E',
  errorLight:    '#FFF0F0',
};
const FONT = '"Albert Sans", system-ui, sans-serif';

// ─── Animation keyframes ──────────────────────────────────────────────────────
const STYLE_ID = 'insurance-modal-styles';
function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
    @keyframes overlayIn  { from{opacity:0}                                          to{opacity:1} }
    @keyframes modalIn    { from{opacity:0;transform:translateY(14px) scale(.97)}    to{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes overlayOut { from{opacity:1}                                          to{opacity:0} }
    @keyframes modalOut   { from{opacity:1;transform:translateY(0) scale(1)}         to{opacity:0;transform:translateY(10px) scale(.98)} }
  `;
  document.head.appendChild(el);
}

// ─── Initial data ─────────────────────────────────────────────────────────────
const INVOICES_INIT = [
  {
    id: 'inv-1',
    number: 'FAC-001',
    description: 'Maquinaria industrial de perforación',
    amount: 45000,
    incoterm: 'CIF',
    docType: 'PDF',
    checked: true,
    completeness: 'complete',
    partial: { value: '', description: '', units: '' },
  },
  {
    id: 'inv-2',
    number: 'FAC-002',
    description: 'Herramientas y accesorios industriales',
    amount: 32500,
    incoterm: 'FOB',
    docType: 'IMG',
    checked: true,
    completeness: 'complete',
    partial: { value: '', description: '', units: '' },
  },
];

const COVERAGE_OPTS = [
  {
    id: 'door-to-door',
    label: 'Bodega a bodega',
    description: 'Cobertura completa desde origen hasta entrega final',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80',
    recommended: true,
  },
  {
    id: 'origin-to-door',
    label: 'Puerto origen → bodega destino',
    description: 'Desde el embarque internacional hasta tu bodega',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800',
    recommended: false,
  },
  {
    id: 'dest-to-door',
    label: 'Puerto destino → bodega destino',
    description: 'Desde la llegada al país hasta tu bodega',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&q=80',
    recommended: false,
  },
];

const ADICIONALES_ITEMS = [
  { key: 'flete',     label: 'Flete' },
  { key: 'aranceles', label: 'Aranceles / impuestos' },
];

const CONTAINER = { number: 'TCKU3456789', line: 'Evergreen', size: "40' dry", pricePerCert: 28 };

const ENVIO_INIT = {
  puertoOrigen:        'Puerto de Shanghai, CN',
  incoterm:            'CIF',
  pesoTotal:           '2,450 kg',
  paisDestino:         'México',
  ciudadDestino:       'Ciudad de México',
  descripcion:         'Maquinaria industrial',
  posicionArancelaria: '8479.89.99',
  direccionDestino:    'Av. Insurgentes Sur 1234, Col. Del Valle',
};

const ACTIVE_COVERAGES = [
  { key: 'lucro',  label: 'Lucro cesante',      description: 'Hasta 20% del valor',    price: 18 },
  { key: 'gastos', label: 'Gastos adicionales',  description: 'Almacenaje y maniobras', price: 12 },
];
const DISABLED_COVERAGES = [
  { label: 'Errores y omisiones',   note: 'No aplica para México' },
  { label: 'Responsabilidad civil', note: 'No aplica para México' },
];

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, note, badge, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <p style={{
            fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
            color: C.gray400, textTransform: 'uppercase', margin: 0,
          }}>{title}</p>
          {badge}
        </div>
        {note && (
          <span style={{ fontFamily: FONT, fontSize: 11, color: C.gray300 }}>
            {note}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
function Divider() {
  return <div style={{ height: 1, background: C.gray200, margin: '4px 0' }} />;
}

// ─── Shared field input ───────────────────────────────────────────────────────
function FieldInput({ label, placeholder, value, onChange, type = 'text', half, autofilled }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ flex: half ? '0 0 calc(50% - 5px)' : 1, minWidth: 0 }}>
      {label && (
        <p style={{ fontFamily: FONT, fontSize: 11, color: C.gray400, margin: '0 0 4px', fontWeight: 500 }}>
          {label}
        </p>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', height: 38, padding: '0 10px',
          border: `1.5px solid ${focused ? C.primaryLight : autofilled ? C.primaryUL : C.gray200}`,
          borderRadius: 8,
          background: autofilled && !focused ? C.primary50 : C.white,
          fontFamily: FONT, fontSize: 13, color: C.textPrimary,
          outline: 'none', boxSizing: 'border-box',
          transition: 'border-color 0.15s ease, background 0.15s ease',
        }}
      />
    </div>
  );
}

// ─── Invoice › Partial form ───────────────────────────────────────────────────
function PartialForm({ partial, onSetPartial }) {
  return (
    <div style={{
      display: 'flex', gap: 10,
      padding: '14px',
      background: C.white,
      borderTop: `1px dashed ${C.gray200}`,
    }}>
      <FieldInput
        label="Unidades a asegurar"
        placeholder="0"
        type="number"
        value={partial.units}
        onChange={v => onSetPartial('units', v)}
      />
      <FieldInput
        label="Valor del embarque parcial (USD)"
        placeholder="0.00"
        type="number"
        value={partial.value}
        onChange={v => onSetPartial('value', v)}
      />
    </div>
  );
}

// ─── Invoice › Completeness sub-section ──────────────────────────────────────
function CompletenessSection({ completeness, onSetCompleteness, partial, onSetPartial }) {
  const isPartial = completeness === 'partial';

  return (
    <div>
      {/* Question + toggle */}
      <div style={{ padding: '10px 14px', background: C.gray100, display: 'flex', alignItems: 'center', gap: 12 }}>
        <p style={{
          fontFamily: FONT, fontSize: 12, fontWeight: 500,
          color: C.textSecondary, margin: 0, whiteSpace: 'nowrap',
        }}>
          ¿Asegurar embarque completo?
        </p>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => onSetCompleteness('complete')}
            style={{
              height: 30, padding: '0 12px', borderRadius: 20, cursor: 'pointer',
              border: `1.5px solid ${!isPartial ? C.primaryLight : C.gray200}`,
              background: !isPartial ? C.primaryLight : C.white,
              fontFamily: FONT, fontSize: 12, fontWeight: 500,
              color: !isPartial ? C.white : C.gray400,
              display: 'flex', alignItems: 'center', gap: 5,
              transition: 'all 0.15s ease',
            }}
          >
            {!isPartial && (
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M2 5.5L4.5 8L9 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            Sí, completo
          </button>
          <button
            onClick={() => onSetCompleteness('partial')}
            style={{
              height: 30, padding: '0 12px', borderRadius: 20, cursor: 'pointer',
              border: `1.5px solid ${isPartial ? C.primaryLight : C.gray200}`,
              background: isPartial ? C.primary50 : C.white,
              fontFamily: FONT, fontSize: 12, fontWeight: 500,
              color: isPartial ? C.primaryLight : C.gray400,
              transition: 'all 0.15s ease',
            }}
          >
            No, solo una parte
          </button>
        </div>
      </div>

      {/* Partial form — animated expand */}
      <div style={{
        overflow: 'hidden',
        maxHeight: isPartial ? '260px' : '0',
        transition: 'max-height 0.28s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <PartialForm partial={partial} onSetPartial={onSetPartial} />
      </div>
    </div>
  );
}

// ─── Invoice row ──────────────────────────────────────────────────────────────
function InvoiceRow({ invoice, onToggle, onSetCompleteness, onSetPartial }) {
  const { id, number, description, amount, incoterm, docType, checked, completeness, partial } = invoice;
  const isPDF = docType === 'PDF';

  return (
    <div style={{
      opacity: checked ? 1 : 0.5,
      transition: 'opacity 0.2s ease',
    }}>
      {/* ── Main row (clickable to toggle) ── */}
      <div
        onClick={() => onToggle(id)}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 0',
          cursor: 'pointer',
        }}
      >
        {/* Checkbox */}
        <div style={{
          width: 18, height: 18, borderRadius: 4, flexShrink: 0,
          border: `2px solid ${checked ? C.primaryLight : C.gray300}`,
          background: checked ? C.primaryLight : C.white,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s ease',
        }}>
          {checked && (
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M2 5.5L4.5 8L9 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>

        {/* Doc type tag */}
        <div style={{
          width: 34, height: 34, borderRadius: 6, flexShrink: 0,
          background: isPDF ? C.errorLight : C.primary50,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: FONT, fontSize: 8, fontWeight: 700, letterSpacing: '0.5px',
            color: isPDF ? C.errorMain : C.primaryLight,
          }}>{docType}</span>
        </div>

        {/* Number + description */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: C.textPrimary, margin: 0 }}>
            {number}
          </p>
          <p style={{
            fontFamily: FONT, fontSize: 12, color: C.gray400, margin: '2px 0 0',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {description}
          </p>
        </div>

        {/* Amount + incoterm */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: C.textPrimary, margin: 0 }}>
            USD {amount.toLocaleString()}
          </p>
          <p style={{ fontFamily: FONT, fontSize: 11, color: C.gray400, margin: '3px 0 0', letterSpacing: '0.04em' }}>
            {incoterm}
          </p>
        </div>
      </div>

      {/* ── Completeness sub-section (hidden when unchecked via opacity on parent) ── */}
      {checked && (
        <div style={{ borderTop: `1px solid ${C.gray200}` }}>
          <CompletenessSection
            completeness={completeness}
            onSetCompleteness={(val) => onSetCompleteness(id, val)}
            partial={partial}
            onSetPartial={(field, val) => onSetPartial(id, field, val)}
          />
        </div>
      )}
    </div>
  );
}

// ─── Invoice list ─────────────────────────────────────────────────────────────
function InvoiceList({ items, onToggle, onSetCompleteness, onSetPartial }) {
  const total = items.reduce((sum, inv) => {
    if (!inv.checked) return sum;
    if (inv.completeness === 'complete') return sum + inv.amount;
    return sum + (parseFloat(inv.partial.value) || 0);
  }, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {items.map((inv, idx) => (
        <div key={inv.id}>
          {idx > 0 && <Divider />}
          <InvoiceRow
            invoice={inv}
            onToggle={onToggle}
            onSetCompleteness={onSetCompleteness}
            onSetPartial={onSetPartial}
          />
        </div>
      ))}

      <Divider />

      {/* ── Total a asegurar ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '11px 0',
      }}>
        <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: C.gray400 }}>
          Total a asegurar
        </span>
        <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.primary }}>
          USD {total.toLocaleString('es', { minimumFractionDigits: 0 })}
        </span>
      </div>
    </div>
  );
}

// ─── Coverage selector ────────────────────────────────────────────────────────
function CoverageSelector({ selected, onChange }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
      {COVERAGE_OPTS.map(opt => {
        const active = selected === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: 0, border: 'none', background: 'transparent',
              cursor: 'pointer', textAlign: 'center',
              borderRadius: 10, overflow: 'hidden',
              outline: `2px solid ${active ? C.primaryLight : C.gray200}`,
              outlineOffset: -2,
              boxShadow: active ? `0 0 0 3px ${C.primaryUL}` : 'none',
              transition: 'outline-color 0.15s ease, box-shadow 0.15s ease',
            }}
          >
            {/* Card image */}
            <div style={{ width: '100%', height: 88, overflow: 'hidden', flexShrink: 0 }}>
              <img
                src={opt.image}
                alt={opt.label}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* Card body */}
            <div style={{
              width: '100%', padding: '10px 10px 12px',
              background: active ? C.primary50 : C.white,
              transition: 'background 0.15s ease',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
              <span style={{
                fontFamily: FONT, fontSize: 12, fontWeight: 700, lineHeight: 1.3,
                color: active ? C.primaryLight : C.primary,
                transition: 'color 0.15s ease',
              }}>
                {opt.label}
              </span>
              <span style={{
                fontFamily: FONT, fontSize: 11, fontWeight: 400, lineHeight: 1.4,
                color: C.gray400,
              }}>
                {opt.description}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Additional values ────────────────────────────────────────────────────────
function ValoresAdicionales({ adicionales, setAdicionales }) {
  function activate(key) {
    setAdicionales(prev => ({ ...prev, [key]: { ...prev[key], active: true } }));
  }
  function deactivate(key) {
    setAdicionales(prev => ({ ...prev, [key]: { active: false, value: '' } }));
  }
  function updateValue(key, val) {
    setAdicionales(prev => ({ ...prev, [key]: { ...prev[key], value: val } }));
  }

  const allActive = ADICIONALES_ITEMS.every(i => adicionales[i.key].active);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* Inline chips row — collapses when all active */}
      <div style={{
        display: 'flex', gap: 8,
        maxHeight: allActive ? '0' : '54px',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease',
      }}>
        {ADICIONALES_ITEMS.map(item => {
          const isActive = adicionales[item.key].active;
          return (
            <div key={item.key} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 8, padding: '10px 0',
              opacity: isActive ? 0 : 1,
              pointerEvents: isActive ? 'none' : 'auto',
              transition: 'opacity 0.22s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <PlusCircleIcon />
                <span style={{ fontFamily: FONT, fontSize: 13, color: C.textSecondary, fontWeight: 500 }}>
                  {item.label}
                </span>
              </div>
              <button onClick={() => activate(item.key)} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontFamily: FONT, fontSize: 12, fontWeight: 600, color: C.primaryLight,
                padding: 0,
              }}>
                Agregar
              </button>
            </div>
          );
        })}
      </div>

      {/* Active fields — expand when activated */}
      {ADICIONALES_ITEMS.map(item => {
        const isActive = adicionales[item.key].active;
        return (
          <div key={item.key} style={{
            maxHeight: isActive ? '80px' : '0',
            opacity: isActive ? 1 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.28s ease, opacity 0.22s ease',
          }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', paddingTop: 2 }}>
              <FieldInput
                label={`${item.label} (USD)`}
                placeholder="0.00"
                type="number"
                value={adicionales[item.key].value}
                onChange={v => updateValue(item.key, v)}
              />
              <button onClick={() => deactivate(item.key)} style={{
                width: 38, height: 38, flexShrink: 0, marginBottom: 0,
                border: `1.5px solid ${C.gray200}`, borderRadius: 8,
                background: C.white, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: C.gray300, fontSize: 18,
              }}>×</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Container row ────────────────────────────────────────────────────────────
function ContenedorAsegurar({ checked, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '13px 14px',
        borderRadius: 10, cursor: 'pointer',
        border: `1.5px solid ${checked ? C.primaryLight : C.gray200}`,
        background: checked ? C.primary50 : C.white,
        opacity: checked ? 1 : 0.5,
        transition: 'all 0.15s ease',
      }}
    >
      {/* Checkbox */}
      <div style={{
        width: 18, height: 18, borderRadius: 4, flexShrink: 0,
        border: `2px solid ${checked ? C.primaryLight : C.gray300}`,
        background: checked ? C.primaryLight : C.white,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s ease',
      }}>
        {checked && (
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M2 5.5L4.5 8L9 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      {/* Container icon */}
      <div style={{
        width: 34, height: 34, borderRadius: 8, flexShrink: 0,
        background: C.gray100, border: `1px solid ${C.gray200}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <ContainerIcon />
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: C.textPrimary, margin: 0 }}>
          {CONTAINER.number}
        </p>
        <p style={{ fontFamily: FONT, fontSize: 12, color: C.gray400, margin: '2px 0 0' }}>
          {CONTAINER.line} · {CONTAINER.size}
        </p>
      </div>

      {/* Price badge */}
      <span style={{
        background: '#EBF5E8', color: C.successDark,
        borderRadius: 20, padding: '4px 10px',
        fontFamily: FONT, fontSize: 12, fontWeight: 600,
        whiteSpace: 'nowrap', flexShrink: 0,
      }}>
        +USD {CONTAINER.pricePerCert} / cert.
      </span>
    </div>
  );
}

// ─── Auto badge ───────────────────────────────────────────────────────────────
function AutoBadge() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: C.primary50, color: C.primaryLight,
      border: `1px solid ${C.primaryUL}`,
      borderRadius: 10, padding: '2px 7px',
      fontFamily: FONT, fontSize: 10, fontWeight: 600, letterSpacing: '0.02em',
    }}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M5.5 1L2 5.5h3L4 9l4-5H5l.5-3z" fill={C.primaryLight}/>
      </svg>
      Autocompletado
    </span>
  );
}

// ─── Toggle switch ────────────────────────────────────────────────────────────
function ToggleSwitch({ active, onToggle, disabled }) {
  return (
    <div
      onClick={disabled ? undefined : onToggle}
      style={{
        width: 38, height: 22, borderRadius: 11, flexShrink: 0,
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: active ? C.primaryLight : C.gray200,
        position: 'relative', transition: 'background 0.2s ease',
      }}
    >
      <div style={{
        position: 'absolute', top: 3,
        left: active ? 19 : 3,
        width: 16, height: 16, borderRadius: '50%', background: C.white,
        transition: 'left 0.2s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
      }} />
    </div>
  );
}

// ─── Envío section ────────────────────────────────────────────────────────────
function EnvioSection({ envio, setEnvio }) {
  function update(key, val) { setEnvio(prev => ({ ...prev, [key]: val })); }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <FieldInput autofilled label="Puerto de origen"  value={envio.puertoOrigen}  onChange={v => update('puertoOrigen', v)} />
        <FieldInput autofilled label="Incoterm"          value={envio.incoterm}       onChange={v => update('incoterm', v)} />
        <FieldInput autofilled label="Peso total"        value={envio.pesoTotal}      onChange={v => update('pesoTotal', v)} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <FieldInput autofilled label="País destino"      value={envio.paisDestino}    onChange={v => update('paisDestino', v)} />
        <FieldInput autofilled label="Ciudad destino"    value={envio.ciudadDestino}  onChange={v => update('ciudadDestino', v)} />
        <FieldInput autofilled label="Descripción"       value={envio.descripcion}    onChange={v => update('descripcion', v)} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <FieldInput autofilled label="Posición arancelaria" value={envio.posicionArancelaria} onChange={v => update('posicionArancelaria', v)} />
        <FieldInput autofilled label="Dirección destino"    value={envio.direccionDestino}     onChange={v => update('direccionDestino', v)} />
      </div>
    </div>
  );
}

// ─── Coberturas adicionales ───────────────────────────────────────────────────
function CoberturasAdicionales({ coberturas, setCoberturas }) {
  function toggle(key) { setCoberturas(prev => ({ ...prev, [key]: !prev[key] })); }
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {/* Left – activatable */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {ACTIVE_COVERAGES.map((cov, idx) => {
          const active = coberturas[cov.key];
          return (
            <div key={cov.key}>
              {idx > 0 && <Divider />}
              <div style={{ padding: '12px 0' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <ToggleSwitch active={active} onToggle={() => toggle(cov.key)} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: C.textPrimary, margin: 0 }}>
                      {cov.label}
                    </p>
                    <p style={{ fontFamily: FONT, fontSize: 11, color: C.gray400, margin: '2px 0 0' }}>
                      {cov.description}
                    </p>
                  </div>
                  <span style={{
                    background: '#EBF5E8', color: C.successDark,
                    borderRadius: 20, padding: '3px 8px',
                    fontFamily: FONT, fontSize: 11, fontWeight: 600,
                    whiteSpace: 'nowrap', flexShrink: 0,
                  }}>
                    +USD {cov.price}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Right – disabled */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {DISABLED_COVERAGES.map((cov, idx) => (
          <div key={cov.label}>
            {idx > 0 && <Divider />}
            <div style={{ padding: '12px 0' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <ToggleSwitch active={false} disabled />
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: C.gray300, margin: 0 }}>
                    {cov.label}
                  </p>
                  <p style={{ fontFamily: FONT, fontSize: 11, color: C.gray300, margin: '2px 0 0' }}>
                    {cov.note}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Resumen de costo ─────────────────────────────────────────────────────────
function ResumenCosto({ prima, iva, total }) {
  const fmt = n => n.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '18px 20px', borderRadius: 12,
      background: C.primary,
    }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: FONT, fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.55)', margin: '0 0 4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Prima base (0.35%)
        </p>
        <p style={{ fontFamily: FONT, fontSize: 17, fontWeight: 700, color: '#FFF', margin: 0 }}>
          USD {fmt(prima)}
        </p>
      </div>
      <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.15)', margin: '0 20px', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: FONT, fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.55)', margin: '0 0 4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          IVA (19%)
        </p>
        <p style={{ fontFamily: FONT, fontSize: 17, fontWeight: 700, color: '#FFF', margin: 0 }}>
          USD {fmt(iva)}
        </p>
      </div>
      <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.15)', margin: '0 20px', flexShrink: 0 }} />
      <div style={{ textAlign: 'right' }}>
        <p style={{ fontFamily: FONT, fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.55)', margin: '0 0 4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Total póliza
        </p>
        <p style={{ fontFamily: FONT, fontSize: 24, fontWeight: 800, color: '#FFF', margin: 0 }}>
          USD {fmt(total)}
        </p>
      </div>
    </div>
  );
}

// ─── Modal body ───────────────────────────────────────────────────────────────
function ModalBody({ asegurarTab, setAsegurarTab, invoices, setInvoices, adicionales, setAdicionales, contenedorChecked, setContenedorChecked, envio, setEnvio, coberturas, setCoberturas }) {
  const showMercancia  = asegurarTab === 'mercancia'  || asegurarTab === 'ambos';
  const showContenedor = asegurarTab === 'contenedor' || asegurarTab === 'ambos';

  const base = (() => {
    const invTotal = invoices.reduce((acc, inv) => {
      if (!inv.checked) return acc;
      return acc + (inv.completeness === 'complete' ? inv.amount : (parseFloat(inv.partial.value) || 0));
    }, 0);
    const fleteVal = adicionales.flete.active   ? (parseFloat(adicionales.flete.value)    || 0) : 0;
    const aranVal  = adicionales.aranceles.active ? (parseFloat(adicionales.aranceles.value) || 0) : 0;
    return invTotal + fleteVal + aranVal;
  })();
  const prima = base * 0.0035;
  const iva   = prima * 0.19;
  const total = prima + iva;

  function toggleInvoice(id) {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, checked: !inv.checked } : inv));
  }
  function setCompleteness(id, value) {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, completeness: value } : inv));
  }
  function setPartialField(id, field, value) {
    setInvoices(prev => prev.map(inv =>
      inv.id === id ? { ...inv, partial: { ...inv.partial, [field]: value } } : inv
    ));
  }

  const TABS_ASEGURAR = [
    { id: 'mercancia',  label: 'Mercancía' },
    { id: 'contenedor', label: 'Contenedor' },
    { id: 'ambos',      label: 'Ambos' },
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ¿Qué quieres asegurar? */}
      <Section title="¿Qué quieres asegurar?">
        <div style={{ display: 'flex', gap: 4, background: C.gray100, borderRadius: 10, padding: 4 }}>
          {TABS_ASEGURAR.map(t => {
            const active = asegurarTab === t.id;
            return (
              <button key={t.id} onClick={() => setAsegurarTab(t.id)} style={{
                flex: 1, height: 34, borderRadius: 8, border: 'none',
                background: active ? C.white : 'transparent',
                boxShadow: active ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
                fontFamily: FONT, fontSize: 13, fontWeight: active ? 600 : 400,
                color: active ? C.primaryLight : C.gray400,
                cursor: 'pointer', transition: 'all 0.15s ease',
              }}>
                {t.label}
              </button>
            );
          })}
        </div>
      </Section>

      <Divider />

      {/* Facturas — Mercancía y Ambos */}
      {showMercancia && (
        <>
          <Section title="Facturas a asegurar" note="Todas seleccionadas por defecto">
            <InvoiceList
              items={invoices}
              onToggle={toggleInvoice}
              onSetCompleteness={setCompleteness}
              onSetPartial={setPartialField}
            />
          </Section>
          <Divider />
        </>
      )}

      {/* Contenedor — Contenedor y Ambos */}
      {showContenedor && (
        <>
          <Section title="Contenedor a asegurar">
            <ContenedorAsegurar
              checked={contenedorChecked}
              onToggle={() => setContenedorChecked(v => !v)}
            />
          </Section>
          <Divider />
        </>
      )}

      {/* Valores Adicionales a Asegurar — Mercancía y Ambos */}
      {showMercancia && (
        <>
          <Section title="Valores Adicionales a Asegurar">
            <ValoresAdicionales adicionales={adicionales} setAdicionales={setAdicionales} />
          </Section>
          <Divider />
        </>
      )}

      {/* Coberturas adicionales — siempre visible */}
      <Section title="Coberturas adicionales">
        <CoberturasAdicionales coberturas={coberturas} setCoberturas={setCoberturas} />
      </Section>

      <Divider />

      {/* Información de la mercancía a asegurar — siempre visible */}
      <Section title="Información de la mercancía a asegurar" badge={<AutoBadge />}>
        <EnvioSection envio={envio} setEnvio={setEnvio} />
      </Section>

      <Divider />

      {/* Resumen de costo — siempre visible */}
      <ResumenCosto prima={prima} iva={iva} total={total} />
    </div>
  );
}

// ─── Success screen ───────────────────────────────────────────────────────────
function SuccessScreen({ onListo }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '48px 32px', gap: 0, textAlign: 'center',
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: C.bannerBg, marginBottom: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M9 20L17 28L31 12" stroke={C.successDark} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <p style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.primary, margin: '0 0 12px' }}>
        Póliza emitida
      </p>
      <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: C.textPrimary, margin: '0 0 10px' }}>
        Certificado #VERT-2025-00847 · Vigente hasta 26 Oct 2025
      </p>
      <p style={{ fontFamily: FONT, fontSize: 13, color: C.gray400, margin: '0 0 32px', lineHeight: 1.6, maxWidth: 320 }}>
        El certificado ya está en tu gestión documental
      </p>
      <button onClick={onListo} style={{
        height: 44, padding: '0 36px', borderRadius: 10, border: 'none',
        background: C.successDark,
        fontFamily: FONT, fontSize: 15, fontWeight: 600, color: C.white,
        cursor: 'pointer',
      }}>
        Listo
      </button>
    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────
export default function InsuranceModal({ open, onClose, onEmit }) {
  const [mounted, setMounted]         = useState(false);
  const [closing, setClosing]         = useState(false);
  const [asegurarTab, setAsegurarTab] = useState('mercancia');
  const [invoices, setInvoices]       = useState(INVOICES_INIT);
  const [coverage, setCoverage]             = useState('door-to-door');
  const [adicionales, setAdicionales]             = useState({ flete: { active: false, value: '' }, aranceles: { active: false, value: '' } });
  const [contenedorChecked, setContenedorChecked] = useState(true);
  const [envio, setEnvio]                         = useState(ENVIO_INIT);
  const [coberturas, setCoberturas]               = useState({ lucro: false, gastos: false });
  const [emitted, setEmitted]                     = useState(false);
  const [step, setStep]                           = useState(1);

  useEffect(() => { ensureStyles(); }, []);

  useEffect(() => {
    if (open) { setClosing(false); setMounted(true); setEmitted(false); setStep(1); }
  }, [open]);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => { setMounted(false); setClosing(false); onClose(); }, 180);
  }, [onClose]);

  const handleListo = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setMounted(false);
      setClosing(false);
      setEmitted(false);
      onClose();
      if (onEmit) onEmit();
    }, 180);
  }, [onClose, onEmit]);

  useEffect(() => {
    if (!mounted) return;
    const handler = e => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [mounted, handleClose]);

  if (!mounted) return null;

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(6,7,53,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: closing ? 'overlayOut 0.18s ease forwards' : 'overlayIn 0.2s ease forwards',
        backdropFilter: 'blur(2px)',
      }}
    >
      <div style={{
        width: '100%', maxWidth: 580, maxHeight: '88vh',
        background: C.white, borderRadius: 16,
        boxShadow: '0 20px 60px rgba(6,7,53,0.18)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        animation: closing
          ? 'modalOut 0.18s ease forwards'
          : 'modalIn 0.22s cubic-bezier(0.34,1.2,0.64,1) forwards',
        margin: '0 16px',
      }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: `1px solid ${C.gray200}`, flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: C.bannerBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShieldModalIcon />
            </div>
            <div>
              <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.primary, margin: 0 }}>
                Protege tu mercancía
              </p>
              <p style={{ fontFamily: FONT, fontSize: 12, color: C.gray400, margin: '2px 0 0' }}>
                Configura los detalles de tu póliza
              </p>
            </div>
          </div>
          <button onClick={handleClose} aria-label="Cerrar" style={{
            width: 32, height: 32, borderRadius: 8,
            border: `1px solid ${C.gray200}`, background: C.white,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: C.gray400,
          }}>
            <CloseIcon />
          </button>
        </div>

        {/* ── Body ── */}
        {emitted ? (
          <SuccessScreen onListo={handleListo} />
        ) : step === 1 ? (
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Section title="Alcance de cobertura">
              <CoverageSelector
                selected={coverage}
                onChange={id => { setCoverage(id); setStep(2); }}
              />
            </Section>
          </div>
        ) : (
          <ModalBody
            asegurarTab={asegurarTab} setAsegurarTab={setAsegurarTab}
            invoices={invoices} setInvoices={setInvoices}
            adicionales={adicionales} setAdicionales={setAdicionales}
            contenedorChecked={contenedorChecked} setContenedorChecked={setContenedorChecked}
            envio={envio} setEnvio={setEnvio}
            coberturas={coberturas} setCoberturas={setCoberturas}
          />
        )}

        {/* ── Footer — visible solo en paso 2 ── */}
        {!emitted && step === 2 && (
          <div style={{
            display: 'flex', justifyContent: 'flex-end', gap: 8,
            padding: '16px 24px', borderTop: `1px solid ${C.gray200}`,
            flexShrink: 0, background: C.white,
          }}>
            <button onClick={handleClose} style={{
              height: 40, padding: '0 20px', borderRadius: 8,
              border: `1.5px solid ${C.gray200}`, background: C.white,
              fontFamily: FONT, fontSize: 14, fontWeight: 500, color: C.textSecondary, cursor: 'pointer',
            }}>
              Cancelar
            </button>
            <button onClick={() => setEmitted(true)} style={{
              height: 40, padding: '0 24px', borderRadius: 8, border: 'none',
              background: C.successDark,
              fontFamily: FONT, fontSize: 14, fontWeight: 600, color: C.white,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <ShieldSmallIcon /> Emitir póliza
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

function PlusCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke={C.gray300} strokeWidth="1.3"/>
      <path d="M8 5v6M5 8h6" stroke={C.gray400} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function ContainerIcon() {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
      <rect x="1" y="2" width="16" height="10" rx="1.5" stroke={C.gray400} strokeWidth="1.3"/>
      <path d="M5 2v10M9 2v10M13 2v10" stroke={C.gray400} strokeWidth="1.1" strokeLinecap="round"/>
      <path d="M1 5h16M1 9h16" stroke={C.gray200} strokeWidth="1"/>
      <rect x="7" y="11.5" width="4" height="2" rx="0.5" fill={C.gray300}/>
    </svg>
  );
}

function ShieldModalIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2L17 5.5V10.5C17 14.2 13.9 17.6 10 18.5C6.1 17.6 3 14.2 3 10.5V5.5L10 2Z"
            fill="none" stroke="#03593A" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M7 10l2 2 4-4" stroke="#03593A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ShieldSmallIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M7.5 1.5L13 4.5V8.5C13 11.5 10.5 14 7.5 14.5C4.5 14 2 11.5 2 8.5V4.5L7.5 1.5Z"
            fill="none" stroke="white" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M5 7.5l2 2 3.5-3.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
