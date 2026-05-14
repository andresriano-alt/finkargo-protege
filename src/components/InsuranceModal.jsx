import { useState, useEffect, useCallback } from 'react';
import { Badge }        from 'finkargo-design-system/components/Badge/Badge';
import { Tooltip }      from 'finkargo-design-system/components/Tooltip/Tooltip';
import { Toggle }       from 'finkargo-design-system/components/Toggle/Toggle';
import { Input }        from 'finkargo-design-system/components/Input/Input';
import { Alert }        from 'finkargo-design-system/components/Alert/Alert';
import { Button }       from 'finkargo-design-system/components/Button/Button';
import { Banner }       from 'finkargo-design-system/components/Banner/Banner';
import { RadioGroup }   from 'finkargo-design-system/components/RadioButton/RadioButton';

// ─── Tokens ───────────────────────────────────────────────────────────────────

// DS Neutral palette (tokens/colors.ts neutral)
const N = {
  50:  '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
};

// DS Spacing tokens (tokens/spacing.ts)
const SP = {
  xxs: '4px', xs: '8px', sm: '12px', ms: '16px',
  md: '20px', lg: '24px', xl: '32px', xxl: '48px',
};

// DS Border radius tokens (tokens/borderRadius.ts)
const BR = {
  xxs: '4px', xs: '8px', sm: '12px', ms: '16px',
  md: '20px', full: '9999px',
};

// DS Shadow tokens (tokens/shadows.ts)
const SHADOW = {
  xs: '0px 1px 2px rgba(0,0,0,0.05)',
  sm: '0px 1px 3px rgba(0,0,0,0.10), 0px 1px 2px rgba(0,0,0,0.06)',
  md: '0px 4px 6px rgba(0,0,0,0.07), 0px 2px 4px rgba(0,0,0,0.06)',
};

const C = {
  primary:       '#1C1B66',  // tokens.ts primary.main
  primaryLight:  '#2128B1',  // tokens.ts primary.light
  primaryUL:     '#D6DDF7',  // tokens.ts primary.ultraLight
  primary50:     '#F1F2FF',  // tokens.ts primary[50]
  white:         '#FFFFFF',
  gray100:       N[50],      // neutral[50] — near-white page bg
  gray200:       N[200],     // neutral[200] — borders, dividers
  gray300:       N[300],     // neutral[300] — subtle elements
  gray400:       N[500],     // neutral[500] — secondary text
  textPrimary:   N[700],     // neutral[700] — primary text
  textSecondary: N[600],     // neutral[600] — secondary text
  successDark:   '#03593A',  // tokens.ts success.dark
  successMain:   '#2CA14D',  // tokens.ts success.main
  bannerBg:      '#E0F7E6',  // tokens.ts success.ultraLight
  errorMain:     '#CC071E',  // tokens.ts error.main
  errorLight:    '#FFF0F0',  // tokens.ts error.ultraLight
};
const FONT = '"Albert Sans", system-ui, sans-serif';

// ─── DS typography tokens (tokens/typography.ts) ─────────────────────────────
// h1: 40px·700·1.2 | h2: 20px·600·1.4 | h3: 16px·600·1.4
// labelLg: 16px·600·1.4 | labelMd: 14px·600·1.4 | labelSm: 12px·700·1.4
// body1: 16px·400·1.6 | body2: 14px·400·1.4 | caption: 12px·400·1.4
const TYP = {
  h1:      { fontFamily: FONT, fontSize: '40px', fontWeight: 700, lineHeight: 1.2 },
  h2:      { fontFamily: FONT, fontSize: '20px', fontWeight: 600, lineHeight: 1.4 },
  h3:      { fontFamily: FONT, fontSize: '16px', fontWeight: 600, lineHeight: 1.4 },
  labelLg: { fontFamily: FONT, fontSize: '16px', fontWeight: 600, lineHeight: 1.4 },
  labelMd: { fontFamily: FONT, fontSize: '14px', fontWeight: 600, lineHeight: 1.4 },
  labelSm: { fontFamily: FONT, fontSize: '12px', fontWeight: 700, lineHeight: 1.4 },
  body1:   { fontFamily: FONT, fontSize: '16px', fontWeight: 400, lineHeight: 1.6 },
  body2:   { fontFamily: FONT, fontSize: '14px', fontWeight: 400, lineHeight: 1.4 },
  caption: { fontFamily: FONT, fontSize: '12px', fontWeight: 400, lineHeight: 1.4 },
};

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
  { id: 'inv-1', number: 'FAC-001', description: 'Maquinaria industrial de perforación',    amount: 45000, enabled: true, valueMode: 'complete', partialValue: '' },
  { id: 'inv-2', number: 'FAC-002', description: 'Herramientas y accesorios industriales',  amount: 32500, enabled: true, valueMode: 'complete', partialValue: '' },
];

const CONTAINERS_DATA = [
  { id: 'TCKU3456789', number: 'TCKU3456789', line: 'Evergreen', size: "40' dry",  pricePerCert: 28 },
  { id: 'MSCU1234567', number: 'MSCU1234567', line: 'MSC',       size: "20' dry",  pricePerCert: 28 },
];

const STEP3_STANDARD = [
  { key: 'lucro',  label: 'Lucro cesante',     description: 'Compensa las pérdidas económicas si tu mercancía sufre un siniestro', price: 18 },
  { key: 'gastos', label: 'Gastos adicionales', description: 'Cubre costos de almacenaje y maniobras derivados de un siniestro',     price: 12 },
];

const STEP3_ADVANCED_MX = [
  { key: 'errores',         label: 'Errores y omisiones',   description: 'No aplica para México', price: 9  },
  { key: 'responsabilidad', label: 'Responsabilidad civil', description: 'No aplica para México', price: 11 },
];

const COVERAGE_OPTS = [
  {
    id: 'door-to-door',
    label: 'Bodega a bodega',
    description: 'Cobertura completa desde que tu mercancía sale del proveedor hasta que llega a tu bodega.',
    tooltip: 'Cubre si tu carga se daña durante el transporte terrestre en el país de origen antes de llegar al puerto.',
    recommended: true,
    icon: 'warehouse',
  },
  {
    id: 'origin-to-door',
    label: 'Puerto de origen → tu bodega',
    description: 'Cobertura desde que tu mercancía es embarcada en origen hasta que llega a tu bodega.',
    tooltip: 'Cubre si tu contenedor sufre daños durante la travesía marítima o el transporte terrestre en destino.',
    recommended: false,
    icon: 'ship',
  },
  {
    id: 'dest-to-door',
    label: 'Puerto de destino → tu bodega',
    description: 'Cobertura desde que tu mercancía llega al país hasta que llega a tu bodega.',
    tooltip: 'Cubre si tu mercancía se daña durante el transporte terrestre desde el puerto hasta tu bodega.',
    recommended: false,
    icon: 'truck',
  },
];

// ─── Coverage card icons (inline SVG — el DS no tiene componente Icon) ────────
function WarehouseIcon({ color, size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M3 14L14 6L25 14V24H3V14Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
      <rect x="10" y="17" width="8" height="7" rx="1" stroke={color} strokeWidth="1.5"/>
      <path d="M3 14H25" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function ShipCoverageIcon({ color, size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M5 18L8 13H20L23 18C22 21 18.5 23 14 23C9.5 23 6 21 5 18Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M14 13V8" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 8L20 11.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4 25Q9 27 14 27Q19 27 24 25" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function TruckCoverageIcon({ color, size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <rect x="2" y="9" width="16" height="12" rx="1.5" stroke={color} strokeWidth="1.8"/>
      <path d="M18 13.5H22.5L25.5 17V21H18V13.5Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
      <circle cx="7" cy="22" r="2" stroke={color} strokeWidth="1.5"/>
      <circle cx="22" cy="22" r="2" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
}
function InfoCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M8 7V11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="8" cy="5.5" r="0.6" fill="currentColor"/>
    </svg>
  );
}

const COVERAGE_ICON_MAP = { warehouse: WarehouseIcon, ship: ShipCoverageIcon, truck: TruckCoverageIcon };

// Tokens del DS usados en las tarjetas
const DST = {
  activeBorder:   '#3C47D3',  // secondary.main
  activeBg:       '#E8ECFC',  // secondary[50]
  inactiveBorder: N[200],     // neutral[200]
  titleActive:    '#3C47D3',  // secondary.main
  titleInactive:  '#060735',  // primary.dark
  desc:           N[500],     // neutral[500]
  iconActiveBg:   '#FFFFFF',
  iconInactiveBg: N[100],     // neutral[100]
  iconActive:     '#3C47D3',  // secondary.main
  iconInactive:   N[600],     // neutral[600]
};

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: SP.xs }}>
          <p style={{
            /* DS caption (12px) — 11px has no DS token */
            ...TYP.caption, fontWeight: 700, letterSpacing: '0.08em',
            color: C.gray400, textTransform: 'uppercase', margin: 0,
          }}>{title}</p>
          {badge}
        </div>
        {note && (
          <span style={{
            /* DS caption (12px) — 11px has no DS token */
            ...TYP.caption, color: C.gray300,
          }}>
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
  return <div style={{ height: 1, background: C.gray200, margin: `${SP.xxs} 0` }} />;
}

// ─── Shared field input ───────────────────────────────────────────────────────
function FieldInput({ label, placeholder, value, onChange, type = 'text', half, autofilled }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ flex: half ? '0 0 calc(50% - 5px)' : 1, minWidth: 0 }}>
      {label && (
        <p style={{
          /* DS caption (12px) — 11px has no DS token */
          ...TYP.caption, fontWeight: 500, color: C.gray400, margin: `0 0 ${SP.xxs}`,
        }}>
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
          width: '100%', height: 38, padding: `0 ${SP.xs}`,
          border: `1.5px solid ${focused ? C.primaryLight : autofilled ? C.primaryUL : C.gray200}`,
          borderRadius: BR.xs,
          background: autofilled && !focused ? C.primary50 : C.white,
          /* DS body2 (14px) — 13px has no DS token */
          ...TYP.body2, color: C.textPrimary,
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
      display: 'flex', gap: SP.xs /* SP.xs (8px) — 10px has no DS token */,
      padding: SP.sm /* SP.sm (12px) — 14px has no DS token */,
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
      <div style={{ padding: `${SP.xs} ${SP.sm}` /* SP.xs (8px) top/bottom, SP.sm (12px) left/right — 10px·14px has no DS token */, background: C.gray100, display: 'flex', alignItems: 'center', gap: SP.sm }}>
        <p style={{
          /* DS caption (12px) + medium weight */
          ...TYP.caption, fontWeight: 500,
          color: C.textSecondary, margin: 0, whiteSpace: 'nowrap',
        }}>
          ¿Asegurar embarque completo?
        </p>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => onSetCompleteness('complete')}
            style={{
              height: 30, padding: `0 ${SP.sm}`, borderRadius: BR.md, cursor: 'pointer',
              border: `1.5px solid ${!isPartial ? C.primaryLight : C.gray200}`,
              background: !isPartial ? C.primaryLight : C.white,
              /* DS caption (12px) + medium weight */
              ...TYP.caption, fontWeight: 500,
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
              height: 30, padding: `0 ${SP.sm}`, borderRadius: BR.md, cursor: 'pointer',
              border: `1.5px solid ${isPartial ? C.primaryLight : C.gray200}`,
              background: isPartial ? C.primary50 : C.white,
              /* DS caption (12px) + medium weight */
              ...TYP.caption, fontWeight: 500,
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
          display: 'flex', alignItems: 'center', gap: SP.sm,
          padding: `${SP.sm} 0`,
          cursor: 'pointer',
        }}
      >
        {/* Checkbox */}
        <div style={{
          width: 18, height: 18, borderRadius: BR.xxs, flexShrink: 0,
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
          width: 34, height: 34, borderRadius: BR.xxs /* BR.xxs (4px) — 6px has no DS token */, flexShrink: 0,
          background: isPDF ? C.errorLight : C.primary50,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            /* No DS token for 8px — smallest token is caption (12px); keeping 8px for compact doc-type tag */
            fontFamily: FONT, fontSize: 8, fontWeight: 700, letterSpacing: '0.5px',
            color: isPDF ? C.errorMain : C.primaryLight,
          }}>{docType}</span>
        </div>

        {/* Number + description */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            /* DS body2 (14px) — 13px has no DS token */
            ...TYP.body2, fontWeight: 600, color: C.textPrimary, margin: 0,
          }}>
            {number}
          </p>
          <p style={{
            ...TYP.caption, color: C.gray400, margin: `2px 0 0`,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {description}
          </p>
        </div>

        {/* Amount + incoterm */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{
            /* DS body2 (14px) — 13px has no DS token */
            ...TYP.body2, fontWeight: 700, color: C.textPrimary, margin: 0,
          }}>
            USD {amount.toLocaleString()}
          </p>
          <p style={{
            /* DS caption (12px) — 11px has no DS token */
            ...TYP.caption, color: C.gray400, margin: '3px 0 0', letterSpacing: '0.04em',
          }}>
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
        padding: `${SP.xs} 0` /* SP.xs (8px) — 11px has no DS token */,
      }}>
        <span style={{
          /* DS body2 (14px) — 13px has no DS token */
          ...TYP.body2, fontWeight: 600, color: C.gray400,
        }}>
          Total a asegurar
        </span>
        <span style={{ ...TYP.h3, color: C.primary }}>
          USD {total.toLocaleString('es', { minimumFractionDigits: 0 })}
        </span>
      </div>
    </div>
  );
}

// ─── Coverage selector ────────────────────────────────────────────────────────
function CoverageSelector({ selected, onChange }) {
  const [openTooltip, setOpenTooltip] = useState(null);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: SP.sm }}>
      {COVERAGE_OPTS.map(opt => {
        const isSelected    = selected === opt.id;
        const isTooltipOpen = openTooltip === opt.id;
        const CovIcon       = COVERAGE_ICON_MAP[opt.icon];

        return (
          <div
            key={opt.id}
            onClick={() => { onChange(opt.id); setOpenTooltip(null); }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
              padding: `${SP.md} ${SP.ms} ${SP.ms}`,
              border: `${isSelected ? 2 : 1}px solid ${isSelected ? DST.activeBorder : DST.inactiveBorder}`,
              borderRadius: BR.sm,
              background: isSelected ? DST.activeBg : '#FFFFFF',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease, background 0.15s ease',
              gap: SP.xs /* SP.xs (8px) — 10px has no DS token */,
              position: 'relative',
            }}
          >
            {/* Ícono superior (DS recomienda SVG inline — no existe componente Icon) */}
            <div style={{
              width: 44, height: 44, borderRadius: BR.xs /* BR.xs (8px) — 10px has no DS token */,
              background: isSelected ? DST.iconActiveBg : DST.iconInactiveBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <CovIcon color={isSelected ? DST.iconActive : DST.iconInactive} size={24} />
            </div>

            {/* Badge DS — solo en "Bodega a bodega" */}
            {opt.recommended && (
              <Badge
                label="Recomendado para tu operación"
                variant="success"
                size="small"
                badgeStyle="light"
                border={true}
              />
            )}

            {/* Título */}
            <p style={{
              ...TYP.labelMd,
              color: isSelected ? DST.titleActive : DST.titleInactive,
              margin: 0,
              transition: 'color 0.15s ease',
            }}>
              {opt.label}
            </p>

            {/* Descripción */}
            <p style={{
              /* DS body2 (14px) — 13px has no DS token */
              ...TYP.body2,
              color: DST.desc,               // DS neutral.500
              margin: 0, flex: 1,
            }}>
              {opt.description}
            </p>

            {/* Ícono info + Tooltip DS */}
            <div
              style={{ position: 'relative', marginTop: 4 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setOpenTooltip(isTooltipOpen ? null : opt.id)}
                aria-label="Más información sobre esta cobertura"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 24, height: 24,
                  background: 'transparent', border: 'none',
                  cursor: 'pointer', padding: 0,
                  color: isSelected ? DST.activeBorder : DST.desc,
                }}
              >
                <InfoCircleIcon />
              </button>

              {isTooltipOpen && (
                <div style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 8px)',
                  left: -8,
                  zIndex: 50,
                }}>
                  <Tooltip
                    description={opt.tooltip}
                    placement="top"
                    showClose={true}
                    onClose={() => setOpenTooltip(null)}
                  />
                </div>
              )}
            </div>
          </div>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs /* SP.xs (8px) — 10px has no DS token */ }}>

      {/* Inline chips row — collapses when all active */}
      <div style={{
        display: 'flex', gap: SP.xs,
        maxHeight: allActive ? '0' : '54px',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease',
      }}>
        {ADICIONALES_ITEMS.map(item => {
          const isActive = adicionales[item.key].active;
          return (
            <div key={item.key} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: SP.xs, padding: `${SP.xs} 0`,
              opacity: isActive ? 0 : 1,
              pointerEvents: isActive ? 'none' : 'auto',
              transition: 'opacity 0.22s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: SP.xs }}>
                <PlusCircleIcon />
                <span style={{
                  /* DS body2 (14px) — 13px has no DS token */
                  ...TYP.body2, fontWeight: 500, color: C.textSecondary,
                }}>
                  {item.label}
                </span>
              </div>
              <button onClick={() => activate(item.key)} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                ...TYP.caption, fontWeight: 600, color: C.primaryLight,
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
            <div style={{ display: 'flex', gap: SP.xs, alignItems: 'flex-end', paddingTop: 2 }}>
              <FieldInput
                label={`${item.label} (USD)`}
                placeholder="0.00"
                type="number"
                value={adicionales[item.key].value}
                onChange={v => updateValue(item.key, v)}
              />
              <button onClick={() => deactivate(item.key)} style={{
                width: 38, height: 38, flexShrink: 0, marginBottom: 0,
                border: `1.5px solid ${C.gray200}`, borderRadius: BR.xs,
                background: C.white, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: C.gray300, fontSize: 18, /* No DS token for 18px — used for × symbol sizing only */
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
        display: 'flex', alignItems: 'center', gap: SP.sm,
        padding: `${SP.sm} ${SP.sm}` /* SP.sm (12px) — 13px·14px has no DS token */,
        borderRadius: BR.xs /* BR.xs (8px) — 10px has no DS token */, cursor: 'pointer',
        border: `1.5px solid ${checked ? C.primaryLight : C.gray200}`,
        background: checked ? C.primary50 : C.white,
        opacity: checked ? 1 : 0.5,
        transition: 'all 0.15s ease',
      }}
    >
      {/* Checkbox */}
      <div style={{
        width: 18, height: 18, borderRadius: BR.xxs, flexShrink: 0,
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
        width: 34, height: 34, borderRadius: BR.xs, flexShrink: 0,
        background: C.gray100, border: `1px solid ${C.gray200}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <ContainerIcon />
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          /* DS body2 (14px) — 13px has no DS token */
          ...TYP.body2, fontWeight: 600, color: C.textPrimary, margin: 0,
        }}>
          {CONTAINER.number}
        </p>
        <p style={{ ...TYP.caption, color: C.gray400, margin: '2px 0 0' }}>
          {CONTAINER.line} · {CONTAINER.size}
        </p>
      </div>

      {/* Price badge */}
      <span style={{
        background: C.bannerBg, color: C.successDark,
        borderRadius: BR.md, padding: `${SP.xxs} ${SP.xs}`,
        ...TYP.caption, fontWeight: 600,
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
      display: 'inline-flex', alignItems: 'center', gap: SP.xxs,
      background: C.primary50, color: C.primaryLight,
      border: `1px solid ${C.primaryUL}`,
      borderRadius: BR.xs /* BR.xs (8px) — 10px has no DS token */, padding: `2px ${SP.xxs}`,
      /* DS caption (12px) — 10px has no DS token */
      ...TYP.caption, fontWeight: 600, letterSpacing: '0.02em',
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
// DS success tokens: main #2CA14D · dark #03593A · light #AAEAA8 · ultraLight #E0F7E6
function SuccessScreen({ onListo }) {
  return (
    <div style={{
      flex: 1, overflowY: 'auto',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: `52px ${SP.xl}`, textAlign: 'center',
      background: N[50],
    }}>

      {/* Check icon — DS success.ultraLight bg · success.light border · success.dark stroke */}
      <div style={{
        width: 96, height: 96,
        /* No DS token for circular radius — '50%' is the correct CSS for circles */
        borderRadius: '50%',
        background: '#E0F7E6',           // DS success.ultraLight
        border: '3px solid #AAEAA8',     // DS success.light
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 28, flexShrink: 0,
      }}>
        <svg width="46" height="46" viewBox="0 0 46 46" fill="none" aria-hidden="true">
          <path
            d="M11 23L19.5 31.5L35 15"
            stroke="#03593A"             // DS success.dark
            strokeWidth="3.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Título — DS typography.h2 (20px · 600 · 1.4) */}
      <p style={{ ...TYP.h2, color: '#060735', margin: `0 0 ${SP.xs}` }}>
        ¡Tu mercancía está protegida! ✓
      </p>

      {/* Subtítulo — DS typography.body2 */}
      <p style={{ ...TYP.body2, color: N[500], margin: `0 0 ${SP.xl}` }}>
        Certificado #VERT-2025-00847 · Vigente hasta 26 Oct 2025
      </p>

      {/* Botón Listo — DS Button primary */}
      <Button variant="primary" size="medium" onClick={onListo}>
        Listo
      </Button>

    </div>
  );
}

// ─── Step 2 — Invoice card ────────────────────────────────────────────────────
function InvoiceCard({ invoice, onUpdate }) {
  const fmt         = n => n.toLocaleString('es-CO', { minimumFractionDigits: 0 });
  const partial     = parseFloat(invoice.partialValue) || 0;
  const threshold80 = invoice.amount * 0.8;
  const showAlert   = invoice.enabled && invoice.valueMode === 'partial' && partial > 0 && partial < threshold80;

  const radioOptions = [
    { value: 'complete', label: `Valor completo — USD ${fmt(invoice.amount)}` },
    { value: 'partial',  label: 'Solo una parte — ingresa el monto que quieres asegurar' },
  ];

  return (
    <div style={{
      background: '#FFFFFF', borderRadius: BR.sm,
      border: `1px solid ${N[200]}`,
      padding: SP.md,
      display: 'flex', flexDirection: 'column', gap: SP.sm,
    }}>
      {/* Header row: info + amount + DS Toggle */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: SP.ms }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: `0 0 2px`, ...TYP.labelMd, color: '#060735' }}>
            {invoice.number}
          </p>
          <p style={{ margin: 0, ...TYP.body2, color: N[500] }}>
            {invoice.description}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexShrink: 0, paddingTop: 2 }}>
          <span style={{
            ...TYP.labelMd, color: '#060735',
            opacity: invoice.enabled ? 1 : 0.4, transition: 'opacity 0.15s',
          }}>
            USD {fmt(invoice.amount)}
          </span>
          {/* DS Toggle component */}
          <Toggle
            checked={invoice.enabled}
            size="small"
            onChange={checked => onUpdate({ ...invoice, enabled: checked, valueMode: 'complete', partialValue: '' })}
          />
        </div>
      </div>

      {/* DS RadioGroup — visible solo cuando toggle está encendido */}
      {invoice.enabled && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, paddingTop: SP.xxs }}>
          <p style={{ ...TYP.labelMd, color: N[700], margin: 0 }}>
            ¿Qué quieres asegurar de esta factura?
          </p>
          <RadioGroup
            name={`invoice-value-mode-${invoice.id}`}
            options={radioOptions}
            value={invoice.valueMode}
            onChange={mode => onUpdate({ ...invoice, valueMode: mode, partialValue: '' })}
          />

          {/* DS Input — visible cuando opción B está seleccionada */}
          {invoice.valueMode === 'partial' && (
            <Input
              label="Ingresa el valor a asegurar"
              placeholder="Ingresa el valor a asegurar"
              type="number"
              value={invoice.partialValue}
              onChange={e => onUpdate({ ...invoice, partialValue: e.target.value })}
            />
          )}

          {/* DS Alert — visible cuando valor es menor al 80% */}
          {showAlert && (
            <Alert
              variant="warning"
              alertStyle="border"
              title="Asegurar menos del valor total puede dejar parte de tu mercancía sin cobertura en caso de siniestro total."
            />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Step 2 — Resumen panel ───────────────────────────────────────────────────
function ResumenRow({ label, value, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: SP.xs }}>
      <span style={{
        /* bold: DS labelMd (14px·600); non-bold: DS body2 (14px·400) — 13px has no DS token */
        ...(bold ? TYP.labelMd : TYP.body2),
        color: bold ? '#060735' : N[500],
      }}>
        {label}
      </span>
      <span style={{
        /* bold: DS labelLg (16px·600) — 15px has no DS token; non-bold: DS body2 + medium weight */
        ...(bold ? TYP.labelLg : { ...TYP.body2, fontWeight: 500 }),
        /* DS labelLg (16px) — 15px has no DS token */
        color: bold ? '#060735' : N[700],
        whiteSpace: 'nowrap',
      }}>
        {value}
      </span>
    </div>
  );
}

function ResumenPanel({ totalInsured, contenedoresCost = 0, prima, iva, total }) {
  const fmt = n => n.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtInt = n => n.toLocaleString('es-CO', { minimumFractionDigits: 0 });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <p style={{
        /* DS caption (12px) — 11px has no DS token */
        ...TYP.caption, fontWeight: 700,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: N[500], margin: `0 0 ${SP.md}`,
      }}>
        Resumen de cobertura
      </p>

      <ResumenRow label="Valor asegurado total" value={`USD ${fmtInt(totalInsured)}`} bold />

      <div style={{ height: 1, background: N[200], margin: `${SP.ms} 0` }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs /* SP.xs (8px) — 10px has no DS token */ }}>
        <ResumenRow label="Prima base (0.35%)" value={`USD ${fmt(prima)}`} />
        {contenedoresCost > 0 && (
          <ResumenRow label="Contenedores" value={`+USD ${fmt(contenedoresCost)}`} />
        )}
        <ResumenRow label="IVA (19%)"           value={`USD ${fmt(iva)}`} />
      </div>

      <div style={{ height: 1, background: N[200], margin: `${SP.ms} 0` }} />

      <ResumenRow label="Total póliza" value={`USD ${fmt(total)}`} bold />

      <p style={{
        ...TYP.caption, color: N[400],
        margin: `${SP.ms} 0 0`, lineHeight: 1.5,
      }}>
        La prima equivale al 0.35% del valor asegurado.
      </p>
    </div>
  );
}

// ─── Step 2 — Main layout ─────────────────────────────────────────────────────
function Step2({ invoices, onUpdateInvoice, contenedoresChecked, setContenedoresChecked }) {
  const isMultiple = CONTAINERS_DATA.length > 1;

  const totalInsured = invoices.reduce((acc, inv) => {
    if (!inv.enabled) return acc;
    return acc + (inv.valueMode === 'complete' ? inv.amount : (parseFloat(inv.partialValue) || 0));
  }, 0);
  const contenedoresCost = CONTAINERS_DATA
    .filter(c => contenedoresChecked[c.id])
    .reduce((sum, c) => sum + c.pricePerCert, 0);
  const prima = totalInsured * 0.0035;
  const iva   = (prima + contenedoresCost) * 0.19;
  const total = prima + contenedoresCost + iva;

  const SectionLabel = ({ children }) => (
    <p style={{
      /* DS caption (12px) — 11px has no DS token */
      ...TYP.caption, fontWeight: 700,
      letterSpacing: '0.08em', textTransform: 'uppercase',
      color: N[500], margin: 0,
    }}>
      {children}
    </p>
  );

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

      {/* ── Columna izquierda: contenido principal ── */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: `${SP.xl} 28px ${SP.xl} ${SP.xl}`,
        display: 'flex', flexDirection: 'column', gap: 28,
        background: N[50],  // DS neutral.50
      }}>

        {/* Sección: Facturas */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
          <p style={{ ...TYP.h3, color: N[700], margin: 0 }}>
            Selecciona las facturas que quieres asegurar
          </p>
          <p style={{ ...TYP.body2, color: N[500], margin: 0 }}>
            Todas están activas por defecto. Desactiva las que no quieras incluir y elige si aseguras el valor completo o solo una parte.
          </p>
          {invoices.map(inv => (
            <InvoiceCard
              key={inv.id}
              invoice={inv}
              onUpdate={updated => onUpdateInvoice(inv.id, updated)}
            />
          ))}
        </section>

        {/* Sección: Contenedor(es) — DS Toggle */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
          <p style={{ ...TYP.h3, color: N[700], margin: 0 }}>
            {isMultiple ? '¿Quieres asegurar tus contenedores?' : '¿Quieres asegurar tu contenedor?'}
          </p>
          <p style={{ ...TYP.body2, color: N[500], margin: 0 }}>
            {isMultiple
              ? `Encontramos ${CONTAINERS_DATA.length} contenedores en tránsito. Activa los que quieras incluir en tu cobertura.`
              : `Encontramos que tienes el contenedor ${CONTAINERS_DATA[0].number} en tránsito. Actívalo si quieres incluirlo en tu cobertura.`
            }
          </p>

          {isMultiple ? (
            /* Lista de toggles — uno por contenedor */
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
              {CONTAINERS_DATA.map(c => (
                <div key={c.id} style={{
                  background: '#FFFFFF', borderRadius: BR.sm,
                  border: `1px solid ${N[200]}`, padding: SP.md,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: SP.ms,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ ...TYP.labelMd, color: '#060735', margin: 0 }}>
                      {c.number}
                    </p>
                    <p style={{ margin: 0, ...TYP.body2, color: N[500] }}>
                      {c.line} · {c.size} · extraído del BL
                    </p>
                  </div>
                  <Toggle
                    checked={contenedoresChecked[c.id]}
                    size="small"
                    onChange={checked => setContenedoresChecked(prev => ({ ...prev, [c.id]: checked }))}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* Toggle único — comportamiento original */
            <div style={{
              background: '#FFFFFF', borderRadius: BR.sm,
              border: `1px solid ${N[200]}`, padding: SP.md,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: SP.ms,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ ...TYP.labelMd, color: '#060735', margin: 0 }}>
                  Asegurar este contenedor
                </p>
              </div>
              <Toggle
                checked={contenedoresChecked[CONTAINERS_DATA[0].id]}
                size="small"
                onChange={checked => setContenedoresChecked(prev => ({ ...prev, [CONTAINERS_DATA[0].id]: checked }))}
              />
            </div>
          )}
        </section>
      </div>

      {/* ── Columna derecha: Resumen persistente ── */}
      <div style={{
        width: 288,
        borderLeft: `1px solid ${N[200]}`,
        background: '#FFFFFF',
        overflowY: 'auto',
        padding: `${SP.xl} ${SP.lg}`,
        flexShrink: 0,
      }}>
        <ResumenPanel totalInsured={totalInsured} contenedoresCost={contenedoresCost} prima={prima} iva={iva} total={total} />
      </div>
    </div>
  );
}

// ─── Step 3 — Coverage toggle row ────────────────────────────────────────────
function CoverageToggleRow({ cov, enabled, onToggle, disabled = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      gap: SP.ms, padding: `${SP.ms} 0`,
    }}>
      <div style={{ flex: 1 }}>
        <p style={{
          ...TYP.labelMd,
          color: disabled ? N[400] : '#060735', margin: 0,
        }}>
          {cov.label}
        </p>
        {cov.description && (
          <p style={{
            /* DS body2 (14px) — 13px has no DS token */
            /* disabled: N[400] = tertiary text token (neutral[400]) */
            ...TYP.body2, color: disabled ? N[400] : N[500],
            margin: '3px 0 0',
          }}>
            {cov.description}
          </p>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexShrink: 0, paddingTop: 2 }}>
        <span style={{
          background: disabled ? N[100] : '#E0F7E6',
          color: disabled ? N[400] : '#03593A',
          borderRadius: BR.md, padding: `3px ${SP.xs}`,
          ...TYP.caption, fontWeight: 600, whiteSpace: 'nowrap',
        }}>
          +USD {cov.price}
        </span>
        <Toggle
          checked={enabled}
          size="small"
          disabled={disabled}
          onChange={onToggle}
        />
      </div>
    </div>
  );
}

// ─── Step 3 — Unavailable accordion (no DS Accordion — built with DS tokens) ─
function UnavailableAccordion({ open, onToggle, coverages }) {
  return (
    <div style={{ borderTop: `1px solid ${C.gray200}`, marginTop: SP.xs }}>
      <button
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', padding: `${SP.sm} 0` /* SP.sm (12px) — 14px has no DS token */,
          background: 'transparent', border: 'none',
          /* DS body2 (14px) — 13px has no DS token */
          ...TYP.body2, fontWeight: 500,
          color: C.gray400, cursor: 'pointer', gap: SP.xs,
        }}
      >
        <span>Opciones no disponibles para este destino</span>
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.22s ease',
            flexShrink: 0, color: C.gray300,
          }}
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div style={{
        overflow: 'hidden',
        maxHeight: open ? `${coverages.length * 88}px` : '0',
        transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {coverages.map((cov, i) => (
          <div key={cov.key}>
            {i > 0 && <div style={{ height: 1, background: C.gray200 }} />}
            <CoverageToggleRow
              cov={cov}
              enabled={false}
              onToggle={() => {}}
              disabled={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 3 — Resumen panel ───────────────────────────────────────────────────
function ResumenPanelStep3({ baseInvoices, fleteVal, arancVal, prima, coberturas, adicExtra, iva, total }) {
  const fmt    = n => n.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtInt = n => n.toLocaleString('es-CO', { minimumFractionDigits: 0 });

  const totalInsured = baseInvoices + fleteVal + arancVal;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <p style={{
        /* DS caption (12px) — 11px has no DS token */
        ...TYP.caption, fontWeight: 700,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: N[500], margin: `0 0 ${SP.md}`,
      }}>
        Resumen de cobertura
      </p>

      {/* Valor asegurado desglosado */}
      <ResumenRow label="Valor mercancía"         value={`USD ${fmtInt(baseInvoices)}`} />
      {fleteVal > 0 && <ResumenRow label="Flete"              value={`+USD ${fmtInt(fleteVal)}`} />}
      {arancVal > 0 && <ResumenRow label="Aranceles"          value={`+USD ${fmtInt(arancVal)}`} />}

      <div style={{ height: 1, background: N[200], margin: `${SP.sm} 0` /* SP.sm (12px) — 14px has no DS token */ }} />

      <ResumenRow label="Valor asegurado total"  value={`USD ${fmtInt(totalInsured)}`} bold />

      <div style={{ height: 1, background: N[200], margin: `${SP.ms} 0` }} />

      {/* Prima y coberturas */}
      <ResumenRow label="Prima base (0.35%)" value={`USD ${fmt(prima)}`} />
      {coberturas.lucro  && <ResumenRow label="Lucro cesante"      value="+USD 18.00" />}
      {coberturas.gastos && <ResumenRow label="Gastos adicionales" value="+USD 12.00" />}
      <ResumenRow label="IVA (19%)" value={`USD ${fmt(iva)}`} />

      <div style={{ height: 1, background: N[200], margin: `${SP.ms} 0` }} />

      <ResumenRow label="Total póliza" value={`USD ${fmt(total)}`} bold />

      <p style={{
        ...TYP.caption, color: N[400],
        margin: `${SP.ms} 0 0`, lineHeight: 1.5,
      }}>
        La prima equivale al 0.35% del valor asegurado más coberturas adicionales.
      </p>
    </div>
  );
}

// ─── Step 3 — Main layout ─────────────────────────────────────────────────────
function Step3({ invoices, flete, setFlete, aranceles, setAranceles, coberturas, setCoberturas }) {
  const baseInvoices = invoices.reduce((acc, inv) => {
    if (!inv.enabled) return acc;
    return acc + (inv.valueMode === 'complete' ? inv.amount : (parseFloat(inv.partialValue) || 0));
  }, 0);
  const fleteVal = parseFloat(flete)    || 0;
  const arancVal = parseFloat(aranceles) || 0;
  const totalInsured = baseInvoices + fleteVal + arancVal;
  const prima     = totalInsured * 0.0035;
  const adicExtra = STEP3_STANDARD.reduce((sum, cov) => sum + (coberturas[cov.key] ? cov.price : 0), 0);
  const subtotal  = prima + adicExtra;
  const iva       = subtotal * 0.19;
  const total     = subtotal + iva;

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

      {/* ── Columna izquierda ── */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: `${SP.xl} 28px ${SP.xl} ${SP.xl}`,
        display: 'flex', flexDirection: 'column', gap: SP.lg,
        background: N[50],
      }}>

        {/* Bloque 1: Valores adicionales a asegurar */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
          {/* DS typography.h3 — 16px·600·1.4 */}
          <p style={{ ...TYP.h3, color: N[700], margin: 0 }}>
            ¿Hay otros valores que quieras proteger?
          </p>
          <p style={{ ...TYP.body2, color: N[500], margin: 0 }}>
            Si el flete o los aranceles corren por tu cuenta, agrégalos para que queden cubiertos también.
          </p>
          {/* Tarjeta agrupadora — DS borderRadius + neutral.50 surface */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: BR.sm,
            border: `1px solid ${N[200]}`,
            padding: SP.md,
            display: 'flex', gap: SP.ms,
          }}>
            <Input
              label="Flete"
              placeholder="0.00"
              type="number"
              value={flete}
              onChange={e => setFlete(e.target.value)}
            />
            <Input
              label="Aranceles / impuestos"
              placeholder="0.00"
              type="number"
              value={aranceles}
              onChange={e => setAranceles(e.target.value)}
            />
          </div>
        </section>

        {/* Bloque 2: Coberturas adicionales */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
          {/* DS typography.h3 — 16px·600·1.4 */}
          <p style={{ ...TYP.h3, color: N[700], margin: 0 }}>
            ¿Quieres reforzar tu cobertura?
          </p>
          <p style={{ ...TYP.body2, color: N[500], margin: 0 }}>
            Activa las protecciones extra que necesites para tu operación. Puedes desactivarlas si no aplican.
          </p>

          {/* Tarjeta agrupadora */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: BR.sm,
            border: `1px solid ${N[200]}`,
            padding: `0 ${SP.lg}`,
          }}>
            {/* Coberturas activas */}
            {STEP3_STANDARD.map((cov, i) => (
              <div key={cov.key}>
                {i > 0 && <div style={{ height: 1, background: C.gray200 }} />}
                <CoverageToggleRow
                  cov={cov}
                  enabled={coberturas[cov.key]}
                  onToggle={checked => setCoberturas(prev => ({ ...prev, [cov.key]: checked }))}
                />
              </div>
            ))}

            {/* Separador DS */}
            <div style={{ height: 1, background: C.gray200 }} />

            {/* Coberturas deshabilitadas — DS Toggle disabled + nota tertiary (N[400]) */}
            {STEP3_ADVANCED_MX.map((cov, i) => (
              <div key={cov.key}>
                {i > 0 && <div style={{ height: 1, background: C.gray200 }} />}
                <CoverageToggleRow
                  cov={cov}
                  enabled={false}
                  onToggle={() => {}}
                  disabled={true}
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Columna derecha: Resumen persistente ── */}
      <div style={{
        width: 288,
        borderLeft: `1px solid ${N[200]}`,
        background: '#FFFFFF',
        overflowY: 'auto',
        padding: `${SP.xl} ${SP.lg}`,
        flexShrink: 0,
      }}>
        <ResumenPanelStep3
          baseInvoices={baseInvoices}
          fleteVal={fleteVal}
          arancVal={arancVal}
          prima={prima}
          coberturas={coberturas}
          adicExtra={adicExtra}
          iva={iva}
          total={total}
        />
      </div>
    </div>
  );
}

// ─── Step 4 — Initial shipment data ──────────────────────────────────────────
const SHIPMENT_INIT = {
  puertoOrigen:        'Puerto de Shanghai, CN',
  incoterm:            'CIF',
  pesoTotal:           '2,450 kg',
  paisDestino:         'México',
  ciudadDestino:       'Ciudad de México',
  descripcion:         'Maquinaria industrial de perforación y herramientas',
  posicionArancelaria: '8479.89.99',
  direccionEntrega:    'Av. Insurgentes Sur 1234, Col. Del Valle, CDMX',
};

// ─── Step 4 — Resumen panel (reusa ResumenRow) ────────────────────────────────
function ResumenPanelStep4({ totalInsured, prima, adicExtra, iva, total }) {
  const fmt    = n => n.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtInt = n => n.toLocaleString('es-CO', { minimumFractionDigits: 0 });

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <p style={{
        /* DS caption (12px) — 11px has no DS token */
        ...TYP.caption, fontWeight: 700,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: N[500], margin: `0 0 ${SP.md}`,
      }}>
        Resumen de cobertura
      </p>

      <ResumenRow label="Valor asegurado total" value={`USD ${fmtInt(totalInsured)}`} bold />

      <div style={{ height: 1, background: N[200], margin: `${SP.ms} 0` }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs /* SP.xs (8px) — 10px has no DS token */ }}>
        <ResumenRow label="Prima base (0.35%)"    value={`USD ${fmt(prima)}`} />
        {adicExtra > 0 && (
          <ResumenRow label="Coberturas adicionales" value={`+USD ${fmt(adicExtra)}`} />
        )}
        <ResumenRow label="IVA (19%)"             value={`USD ${fmt(iva)}`} />
      </div>

      <div style={{ height: 1, background: N[200], margin: `${SP.ms} 0` }} />

      <ResumenRow label="Total póliza" value={`USD ${fmt(total)}`} bold />

      <p style={{
        ...TYP.caption, color: N[400],
        margin: `${SP.ms} 0 0`, lineHeight: 1.5,
      }}>
        La prima equivale al 0.35% del valor asegurado.
      </p>
    </div>
  );
}

// ─── Step 4 — Main layout ─────────────────────────────────────────────────────
function Step4({ invoices, flete, aranceles, adicCoberturas, shipmentData, setShipmentData }) {
  const baseInvoices = invoices.reduce((acc, inv) => {
    if (!inv.enabled) return acc;
    return acc + (inv.valueMode === 'complete' ? inv.amount : (parseFloat(inv.partialValue) || 0));
  }, 0);
  const fleteVal  = parseFloat(flete)    || 0;
  const arancVal  = parseFloat(aranceles) || 0;
  const totalInsured = baseInvoices + fleteVal + arancVal;
  const prima     = totalInsured * 0.0035;
  const adicExtra = STEP3_STANDARD.reduce((sum, cov) => sum + (adicCoberturas[cov.key] ? cov.price : 0), 0);
  const subtotal  = prima + adicExtra;
  const iva       = subtotal * 0.19;
  const total     = subtotal + iva;

  function update(key, val) {
    setShipmentData(prev => ({ ...prev, [key]: val }));
  }

  // CheckIcon inline SVG — no Icon component in DS
  const CheckIcon = () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M2.5 6.5L5.5 9.5L10.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

      {/* ── Columna izquierda ── */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: `${SP.xl} 28px ${SP.xl} ${SP.xl}`,
        display: 'flex', flexDirection: 'column', gap: SP.lg,
        background: N[50],
      }}>

        {/* Encabezado descriptivo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm /* SP.sm (12px) — 14px has no DS token */ }}>
          <p style={{
            ...TYP.body1, color: N[700],
            margin: 0,
          }}>
            Revisa que los datos de tu mercancía estén correctos, los extrajimos automáticamente de tu BL y factura — edita cualquier campo si algo no coincide.
          </p>

          {/* Sello de verificación — DS Badge con ícono check custom */}
          <div style={{ display: 'inline-flex' }}>
            <Badge
              label="Datos verificados contra BL #EGLV142501045077 y Factura comercial · Hoy 2:47 p.m."
              variant="success"
              size="medium"
              badgeStyle="light"
              border={true}
              showIconLeft={true}
              icon={<CheckIcon />}
            />
          </div>
        </div>

        {/* Grid de campos — tarjeta agrupadora */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: BR.sm,
          border: `1px solid ${N[200]}`,
          padding: SP.lg,
          display: 'flex', flexDirection: 'column', gap: SP.md,
        }}>

          {/* Fila 1: Puerto de origen · Incoterm · Peso total */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: SP.ms }}>
            <Input
              label="Puerto de origen"
              value={shipmentData.puertoOrigen}
              onChange={e => update('puertoOrigen', e.target.value)}
              status="autoAI"
            />
            <Input
              label="Incoterm"
              value={shipmentData.incoterm}
              onChange={e => update('incoterm', e.target.value)}
              status="autoAI"
            />
            <Input
              label="Peso total"
              value={shipmentData.pesoTotal}
              onChange={e => update('pesoTotal', e.target.value)}
              status="autoAI"
            />
          </div>

          {/* Separador DS */}
          <div style={{ height: 1, background: N[200] }} />

          {/* Fila 2: País destino · Ciudad destino */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SP.ms }}>
            <Input
              label="País destino"
              value={shipmentData.paisDestino}
              onChange={e => update('paisDestino', e.target.value)}
              status="autoAI"
            />
            <Input
              label="Ciudad destino"
              value={shipmentData.ciudadDestino}
              onChange={e => update('ciudadDestino', e.target.value)}
              status="autoAI"
            />
          </div>

          {/* Separador DS */}
          <div style={{ height: 1, background: N[200] }} />

          {/* Fila 3: Descripción de la mercancía (full width) */}
          <Input
            label="Descripción de la mercancía"
            value={shipmentData.descripcion}
            onChange={e => update('descripcion', e.target.value)}
            status="autoAI"
          />

          {/* Separador DS */}
          <div style={{ height: 1, background: N[200] }} />

          {/* Fila 4: Posición arancelaria · Dirección de entrega */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: SP.ms }}>
            <Input
              label="Posición arancelaria"
              value={shipmentData.posicionArancelaria}
              onChange={e => update('posicionArancelaria', e.target.value)}
              status="autoAI"
              helperText="Código HS de 8 dígitos"
            />
            <Input
              label="Dirección de entrega"
              value={shipmentData.direccionEntrega}
              onChange={e => update('direccionEntrega', e.target.value)}
              status="autoAI"
            />
          </div>

        </div>
      </div>

      {/* ── Columna derecha: Resumen persistente ── */}
      <div style={{
        width: 288,
        borderLeft: `1px solid ${N[200]}`,
        background: '#FFFFFF',
        overflowY: 'auto',
        padding: `${SP.xl} ${SP.lg}`,
        flexShrink: 0,
      }}>
        <ResumenPanelStep4
          totalInsured={totalInsured}
          prima={prima}
          adicExtra={adicExtra}
          iva={iva}
          total={total}
        />
      </div>
    </div>
  );
}

// ─── Step 5 — Summary row helper ─────────────────────────────────────────────
function SummaryRow({ label, valueNode, topBorder = true }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      gap: SP.ms, padding: `${SP.sm} 0` /* SP.sm (12px) — 14px has no DS token */,
      borderTop: topBorder ? `1px solid ${C.gray200}` : 'none',
    }}>
      <p style={{ ...TYP.body2, color: N[500], margin: 0, flexShrink: 0 }}>{label}</p>
      <div style={{ textAlign: 'right' }}>{valueNode}</div>
    </div>
  );
}

// ─── Step 5 — Main layout ─────────────────────────────────────────────────────
function Step5({ coverage, invoices, contenedoresChecked, flete, aranceles, adicCoberturas }) {
  const fmt    = n => n.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtInt = n => n.toLocaleString('es-CO', { minimumFractionDigits: 0 });

  const baseInvoices = invoices.reduce((acc, inv) => {
    if (!inv.enabled) return acc;
    return acc + (inv.valueMode === 'complete' ? inv.amount : (parseFloat(inv.partialValue) || 0));
  }, 0);
  const fleteVal     = parseFloat(flete)     || 0;
  const arancVal     = parseFloat(aranceles)  || 0;
  const totalInsured = baseInvoices + fleteVal + arancVal;
  const prima        = totalInsured * 0.0035;
  const adicExtra    = STEP3_STANDARD.reduce((sum, cov) => sum + (adicCoberturas[cov.key] ? cov.price : 0), 0);
  const subtotal     = prima + adicExtra;
  const iva          = subtotal * 0.19;
  const total        = subtotal + iva;

  const coverageLabel = {
    'door-to-door':   'Bodega a bodega',
    'origin-to-door': 'Puerto de origen → tu bodega',
    'dest-to-door':   'Puerto de destino → tu bodega',
  }[coverage] ?? coverage;

  const hasAdicionales = adicCoberturas.lucro || adicCoberturas.gastos;
  const hasValoresAd   = fleteVal > 0 || arancVal > 0;

  // Section label inside cards
  const CardSectionLabel = ({ children }) => (
    <p style={{
      ...TYP.labelSm,
      color: N[400], textTransform: 'uppercase',
      letterSpacing: '0.07em', margin: `${SP.ms} 0 ${SP.xs}`,
    }}>
      {children}
    </p>
  );

  return (
    <div style={{
      flex: 1, overflowY: 'auto',
      padding: SP.xl,
      background: N[50],
      display: 'flex', flexDirection: 'column', gap: SP.lg,
    }}>

      {/* Encabezado — DS body1 */}
      <p style={{ ...TYP.body1, color: N[700], margin: 0, maxWidth: 680 }}>
        Revisa el resumen y confirma. Una vez que emitas, el certificado quedará disponible en los documentos de tu importación al instante.
      </p>

      {/* Dos columnas — DS grid layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: SP.md,
        alignItems: 'start',
      }}>

        {/* ── Columna izquierda: resumen de lo contratado ── */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: BR.sm,
          border: `1px solid ${C.gray200}`,
          overflow: 'hidden',
        }}>
          {/* Card header */}
          <div style={{ padding: `18px ${SP.lg}`, borderBottom: `1px solid ${C.gray200}` }}>
            <p style={{ ...TYP.labelLg, color: '#060735', margin: 0 }}>Resumen de cobertura</p>
          </div>

          <div style={{ padding: `0 ${SP.lg} ${SP.xs}` }}>

            {/* Alcance */}
            <CardSectionLabel>Alcance de cobertura</CardSectionLabel>
            <SummaryRow
              topBorder={false}
              label={coverageLabel}
              valueNode={
                <Badge
                  label="Seleccionada"
                  variant="bag"
                  size="small"
                  badgeStyle="light"
                  border={true}
                />
              }
            />

            {/* Facturas */}
            <CardSectionLabel>Facturas aseguradas</CardSectionLabel>
            {invoices.filter(inv => inv.enabled).map((inv, i) => {
              const val = inv.valueMode === 'complete' ? inv.amount : (parseFloat(inv.partialValue) || 0);
              return (
                <div
                  key={inv.id}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    gap: SP.sm, padding: `${SP.xs} 0`,
                    borderTop: i > 0 ? `1px solid ${C.gray200}` : 'none',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ ...TYP.labelMd, color: N[700], margin: 0 }}>{inv.number}</p>
                    <p style={{ ...TYP.caption, color: N[400], margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {inv.description}
                    </p>
                  </div>
                  <p style={{ ...TYP.labelMd, color: '#060735', margin: 0, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    USD {fmtInt(val)}
                  </p>
                </div>
              );
            })}

            {/* Contenedores incluidos */}
            {CONTAINERS_DATA.some(c => contenedoresChecked[c.id]) && (
              <>
                <CardSectionLabel>Contenedor incluido</CardSectionLabel>
                {CONTAINERS_DATA.filter(c => contenedoresChecked[c.id]).map((c, i) => (
                  <SummaryRow
                    key={c.id}
                    topBorder={i > 0}
                    label={`${c.number} · ${c.line}`}
                    valueNode={
                      <Badge label={c.size} variant="neutral" size="small" badgeStyle="light" border={true} />
                    }
                  />
                ))}
              </>
            )}

            {/* Valores adicionales */}
            {hasValoresAd && (
              <>
                <CardSectionLabel>Valores adicionales</CardSectionLabel>
                {fleteVal > 0 && (
                  <SummaryRow
                    topBorder={false}
                    label="Flete"
                    valueNode={<p style={{ ...TYP.labelMd, color: '#060735', margin: 0 }}>USD {fmtInt(fleteVal)}</p>}
                  />
                )}
                {arancVal > 0 && (
                  <SummaryRow
                    topBorder={fleteVal > 0}
                    label="Aranceles / impuestos"
                    valueNode={<p style={{ ...TYP.labelMd, color: '#060735', margin: 0 }}>USD {fmtInt(arancVal)}</p>}
                  />
                )}
              </>
            )}

            {/* Coberturas adicionales activas */}
            {hasAdicionales && (
              <>
                <CardSectionLabel>Coberturas adicionales</CardSectionLabel>
                {adicCoberturas.lucro && (
                  <SummaryRow
                    topBorder={false}
                    label="Lucro cesante"
                    valueNode={<Badge label="+USD 18" variant="success" size="small" badgeStyle="light" border={true} />}
                  />
                )}
                {adicCoberturas.gastos && (
                  <SummaryRow
                    topBorder={adicCoberturas.lucro}
                    label="Gastos adicionales"
                    valueNode={<Badge label="+USD 12" variant="success" size="small" badgeStyle="light" border={true} />}
                  />
                )}
              </>
            )}

            {/* Total asegurado */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: `${SP.ms} 0`,
              borderTop: `1px solid ${C.gray200}`,
              marginTop: SP.xxs,
            }}>
              <p style={{ ...TYP.labelMd, color: N[500], margin: 0 }}>Total asegurado</p>
              <p style={{ ...TYP.h3, color: '#060735', margin: 0 }}>USD {fmtInt(totalInsured)}</p>
            </div>

          </div>
        </div>

        {/* ── Columna derecha: costo final ── */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: BR.sm,
          border: `1px solid ${C.gray200}`,
          overflow: 'hidden',
        }}>
          {/* Card header */}
          <div style={{ padding: `18px ${SP.lg}`, borderBottom: `1px solid ${C.gray200}` }}>
            <p style={{ ...TYP.labelLg, color: '#060735', margin: 0 }}>Costo de la póliza</p>
          </div>

          <div style={{ padding: SP.lg }}>

            {/* Desglose de costos — DS body2 + labelMd */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, marginBottom: SP.lg }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: SP.xs }}>
                <p style={{ ...TYP.body2, color: N[500], margin: 0 }}>Prima base (0.35%)</p>
                <p style={{ ...TYP.labelMd, color: N[700], margin: 0, whiteSpace: 'nowrap' }}>USD {fmt(prima)}</p>
              </div>
              {adicExtra > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: SP.xs }}>
                  <p style={{ ...TYP.body2, color: N[500], margin: 0 }}>Coberturas adicionales</p>
                  <p style={{ ...TYP.labelMd, color: N[700], margin: 0, whiteSpace: 'nowrap' }}>+USD {fmt(adicExtra)}</p>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: SP.xs }}>
                <p style={{ ...TYP.body2, color: N[500], margin: 0 }}>IVA (19%)</p>
                <p style={{ ...TYP.labelMd, color: N[700], margin: 0, whiteSpace: 'nowrap' }}>USD {fmt(iva)}</p>
              </div>
            </div>

            {/* Separador DS */}
            <div style={{ height: 1, background: C.gray200, marginBottom: SP.lg }} />

            {/* Total — DS typography.h1 (token más prominente: 40px · 700 · 1.2) */}
            <div style={{ marginBottom: SP.xxs }}>
              <p style={{ ...TYP.labelSm, color: N[400], textTransform: 'uppercase', letterSpacing: '0.07em', margin: `0 0 ${SP.xxs}` }}>
                Total póliza
              </p>
              <p style={{ ...TYP.h1, color: C.primary, margin: 0 }}>
                USD {fmt(total)}
              </p>
              <p style={{ ...TYP.caption, color: N[400], margin: `${SP.xxs} 0 0` }}>
                IVA incluido
              </p>
            </div>


          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Step Bar ─────────────────────────────────────────────────────────────────
// Colors mapeados desde tokens del design system (tokens.ts)
const DS_STEP = {
  active:      '#3C47D3',  // secondary.main
  done:        '#2CA14D',  // tokens.ts success.main
  inactiveBg:  '#FFFFFF',  // white
  inactiveBdr: N[200],     // neutral[200]
  labelActive: '#3C47D3',  // secondary.main
  labelInact:  N[500],     // neutral[500]
  white:       '#FFFFFF',
  border:      N[200],     // neutral[200] — separador
};

const WIZARD_STEPS = ['Cobertura', 'Mercancía', 'Adicionales', 'Datos', 'Resumen'];
const CIRCLE_SIZE  = 28; // px
const CONNECTOR_TOP = CIRCLE_SIZE / 2; // 14px — alinea al centro del círculo

function StepBar({ activeStep }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start',
      padding: `${SP.ms} ${SP.xl} ${SP.sm}`,
      borderBottom: `1px solid ${DS_STEP.border}`,
      flexShrink: 0, background: '#FFFFFF',
    }}>
      {WIZARD_STEPS.map((label, i) => {
        const num      = i + 1;
        const isActive = num === activeStep;
        const isDone   = num < activeStep;

        // Colores del círculo según estado
        const circleBg  = isActive ? DS_STEP.active : isDone ? DS_STEP.done : DS_STEP.inactiveBg;
        const circleBdr = isActive ? DS_STEP.active : isDone ? DS_STEP.done : DS_STEP.inactiveBdr;
        const numColor  = isActive || isDone ? DS_STEP.white : DS_STEP.labelInact;

        // Color del conector izquierdo: verde si el paso anterior ya está hecho
        const leftConnColor  = i < activeStep ? DS_STEP.done : DS_STEP.inactiveBdr;
        // Color del conector derecho: verde si este paso ya está hecho
        const rightConnColor = isDone ? DS_STEP.done : DS_STEP.inactiveBdr;

        return (
          <div key={num} style={{
            flex: 1,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', position: 'relative',
          }}>
            {/* Conector izquierdo (mitad izquierda de la línea hacia el paso anterior) */}
            {i > 0 && (
              <div style={{
                position: 'absolute',
                top: CONNECTOR_TOP,
                left: 0, width: '50%', height: 2,
                background: leftConnColor,
              }} />
            )}
            {/* Conector derecho (mitad derecha de la línea hacia el paso siguiente) */}
            {i < WIZARD_STEPS.length - 1 && (
              <div style={{
                position: 'absolute',
                top: CONNECTOR_TOP,
                left: '50%', width: '50%', height: 2,
                background: rightConnColor,
              }} />
            )}

            {/* Círculo numerado */}
            <div style={{
              width: CIRCLE_SIZE, height: CIRCLE_SIZE,
              borderRadius: BR.full,
              background: circleBg,
              border: `2px solid ${circleBdr}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', zIndex: 1, flexShrink: 0,
              transition: 'background 0.2s, border-color 0.2s',
            }}>
              <span style={{
                ...TYP.labelSm,
                lineHeight: 1,
                color: numColor,
              }}>
                {num}
              </span>
            </div>

            {/* Etiqueta */}
            <span style={{
              marginTop: 6,
              ...TYP.caption,
              fontWeight: isActive ? 600 : 400,  // DS semibold / regular
              color: isActive ? DS_STEP.labelActive : DS_STEP.labelInact,
              whiteSpace: 'nowrap',
            }}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────
export default function InsuranceModal({ open, onClose, onEmit }) {
  const [coverage, setCoverage]             = useState(null);
  const [invoices, setInvoices]             = useState(INVOICES_INIT);
  const [contenedoresChecked, setContenedoresChecked] = useState(
    () => Object.fromEntries(CONTAINERS_DATA.map(c => [c.id, false]))
  );
  const [flete, setFlete]                   = useState('');
  const [aranceles, setAranceles]           = useState('');
  const [adicCoberturas, setAdicCoberturas] = useState({ lucro: true, gastos: true });
  const [shipmentData, setShipmentData]     = useState(SHIPMENT_INIT);
  const [emitted, setEmitted]               = useState(false);
  const [step, setStep]                     = useState(1);

  const handleUpdateInvoice = (id, updated) =>
    setInvoices(prev => prev.map(inv => inv.id === id ? updated : inv));

  useEffect(() => { ensureStyles(); }, []);

  useEffect(() => {
    if (open) { setEmitted(false); setStep(1); }
  }, [open]);

  const handleClose = useCallback(() => { onClose(); }, [onClose]);

  const handleListo = useCallback(() => {
    setEmitted(false);
    onClose();
    if (onEmit) onEmit();
  }, [onClose, onEmit]);

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleClose]);

  if (!open) return null;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.gray100 }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: SP.ms,
        padding: `${SP.ms} ${SP.xl}`, borderBottom: `1px solid ${C.gray200}`,
        flexShrink: 0, background: C.white,
      }}>
        <button onClick={handleClose} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'transparent', border: 'none',
          /* DS body2 with medium weight */
          ...TYP.body2, fontWeight: 500,
          color: C.textSecondary, cursor: 'pointer', padding: 0, flexShrink: 0,
        }}>
          <BackArrowIcon /> Volver
        </button>
        <div style={{ width: 1, height: 24, background: C.gray200, flexShrink: 0 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: SP.xs /* SP.xs (8px) — 10px has no DS token */ }}>
          <div style={{
            width: 36, height: 36, borderRadius: BR.xs /* BR.xs (8px) — 10px has no DS token */, background: C.bannerBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <ShieldModalIcon />
          </div>
          <div>
            <p style={{ ...TYP.labelLg, fontWeight: 700, color: C.primary, margin: 0 }}>
              Protege tu mercancía
            </p>
            <p style={{ ...TYP.caption, color: C.gray400, margin: '2px 0 0' }}>
              Configura los detalles de tu póliza
            </p>
          </div>
        </div>
      </div>

      {/* ── Step Bar ── */}
      {!emitted && <StepBar activeStep={step} />}

      {/* ── Body ── */}
      {emitted ? (
        <SuccessScreen onListo={handleListo} />
      ) : step === 1 ? (
        <div style={{ flex: 1, overflowY: 'auto', padding: SP.xl }}>
          <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: SP.ms }}>
            <Section title="Alcance de cobertura">
              <CoverageSelector
                selected={coverage}
                onChange={id => setCoverage(id)}
              />
            </Section>
          </div>
        </div>
      ) : step === 2 ? (
        <Step2
          invoices={invoices}
          onUpdateInvoice={handleUpdateInvoice}
          contenedoresChecked={contenedoresChecked}
          setContenedoresChecked={setContenedoresChecked}
        />
      ) : step === 3 ? (
        <Step3
          invoices={invoices}
          flete={flete}
          setFlete={setFlete}
          aranceles={aranceles}
          setAranceles={setAranceles}
          coberturas={adicCoberturas}
          setCoberturas={setAdicCoberturas}
        />
      ) : step === 4 ? (
        <Step4
          invoices={invoices}
          flete={flete}
          aranceles={aranceles}
          adicCoberturas={adicCoberturas}
          shipmentData={shipmentData}
          setShipmentData={setShipmentData}
        />
      ) : (
        <Step5
          coverage={coverage}
          invoices={invoices}
          contenedoresChecked={contenedoresChecked}
          flete={flete}
          aranceles={aranceles}
          adicCoberturas={adicCoberturas}
        />
      )}

      {/* ── Footer — DS Buttons ── */}
      {!emitted && step === 1 && (
        <div style={{
          display: 'flex', justifyContent: 'flex-end',
          padding: `${SP.ms} ${SP.xl}`, borderTop: `1px solid ${C.gray200}`,
          flexShrink: 0, background: C.white,
        }}>
          <Button variant="primary" size="medium" disabled={!coverage} onClick={() => setStep(2)}>
            Continuar
          </Button>
        </div>
      )}
      {!emitted && step === 2 && (
        <div style={{
          display: 'flex', justifyContent: 'flex-end',
          padding: `${SP.ms} ${SP.xl}`, borderTop: `1px solid ${C.gray200}`,
          flexShrink: 0, background: C.white,
        }}>
          <Button variant="primary" size="medium" onClick={() => setStep(3)}>
            Continuar
          </Button>
        </div>
      )}
      {!emitted && step === 3 && (
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          padding: `${SP.ms} ${SP.xl}`, borderTop: `1px solid ${C.gray200}`,
          flexShrink: 0, background: C.white,
        }}>
          <Button variant="secondary" size="medium" onClick={() => setStep(2)}>
            Atrás
          </Button>
          <Button variant="primary" size="medium" onClick={() => setStep(4)}>
            Continuar
          </Button>
        </div>
      )}
      {!emitted && step === 4 && (
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          padding: `${SP.ms} ${SP.xl}`, borderTop: `1px solid ${C.gray200}`,
          flexShrink: 0, background: C.white,
        }}>
          <Button variant="secondary" size="medium" onClick={() => setStep(3)}>
            Atrás
          </Button>
          <Button variant="primary" size="medium" onClick={() => setStep(5)}>
            Continuar
          </Button>
        </div>
      )}
      {!emitted && step === 5 && (
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          padding: `${SP.ms} ${SP.xl}`, borderTop: `1px solid ${C.gray200}`,
          flexShrink: 0, background: C.white,
        }}>
          <Button variant="secondary" size="medium" onClick={() => setStep(4)}>
            Atrás
          </Button>
          <Button variant="primary" size="medium" onClick={() => setEmitted(true)}>
            Emitir póliza
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function BackArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

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

function CalendarCheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="3" width="14" height="13" rx="2" stroke="#03593A" strokeWidth="1.4"/>
      <path d="M2 7h14" stroke="#03593A" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M6 1v3M12 1v3" stroke="#03593A" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M6 11l2 2 4-3.5" stroke="#03593A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
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
