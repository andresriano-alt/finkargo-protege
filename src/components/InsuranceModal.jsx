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
  primaryDark:   '#060735',  // tokens.ts primary.dark
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
  successLight:  '#AAEAA8',  // tokens.ts success.light
  successMain:   '#2CA14D',  // tokens.ts success.main
  bannerBg:      '#E0F7E6',  // tokens.ts success.ultraLight
  errorMain:     '#CC071E',  // tokens.ts error.main
  errorLight:    '#FFF0F0',  // tokens.ts error.ultraLight
  secondary:     '#3C47D3',  // tokens.ts secondary.main
  secondary50:   '#E8ECFC',  // tokens.ts secondary[50]
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
  { id: 'inv-1', number: 'FAC-001', description: 'Maquinaria industrial de perforación',    amount: 45000, incoterm: 'CIF', enabled: true, valueMode: 'complete', partialValue: '' },
  { id: 'inv-2', number: 'FAC-002', description: 'Herramientas y accesorios industriales',  amount: 32500, incoterm: 'CIF', enabled: true, valueMode: 'complete', partialValue: '' },
];

const CONTAINERS_DATA = [
  { id: 'TCKU3456789', number: 'TCKU3456789', line: 'Evergreen', size: "40' dry",  pricePerCert: 28 },
  { id: 'MSCU1234567', number: 'MSCU1234567', line: 'MSC',       size: "20' dry",  pricePerCert: 28 },
];

const STEP3_STANDARD = [
  { key: 'lucro',  label: 'Lucro cesante',     description: 'Compensa las pérdidas económicas si tu carga sufre un siniestro. Activo por defecto.',    price: 18 },
  { key: 'gastos', label: 'Gastos adicionales', description: 'Cubre costos imprevistos como reenvíos o almacenaje por demoras. Activo por defecto.', price: 12 },
];

const STEP3_ADVANCED_MX = [
  { key: 'errores',         label: 'Errores y omisiones',   description: 'No aplica para México', price: 9  },
  { key: 'responsabilidad', label: 'Responsabilidad civil', description: 'No aplica para México', price: 11 },
];

const COVERAGE_OPTS = [
  {
    id: 'door-to-door',
    label: 'Bodega a bodega',
    description: 'Cobertura total del trayecto',
    tooltip: 'Con tu Incoterm FOB, el riesgo pasa a ti desde que la carga embarca. Esta opción te cubre desde ese momento hasta tu bodega.',
    recommended: true,
    icon: 'warehouse',
  },
  {
    id: 'origin-to-door',
    label: 'Desde puerto de origen',
    description: 'Desde embarque hasta tu bodega',
    tooltip: 'Cubre desde que tu carga sube al barco en origen hasta que llega a tu bodega de destino.',
    recommended: false,
    icon: 'ship',
  },
  {
    id: 'dest-to-door',
    label: 'Desde puerto de destino',
    description: 'Solo tramo terrestre local',
    tooltip: 'Cubre el tramo terrestre desde el puerto de destino hasta tu bodega.',
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
  activeBorder:   C.secondary,
  activeBg:       C.secondary50,
  inactiveBorder: N[200],
  titleActive:    C.secondary,
  titleInactive:  C.primaryDark,
  desc:           N[500],
  iconActiveBg:   C.white,
  iconInactiveBg: N[100],
  iconActive:     C.secondary,
  iconInactive:   N[600],
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
                <path d="M2 5.5L4.5 8L9 3" stroke={C.white} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
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
              <path d="M2 5.5L4.5 8L9 3" stroke={C.white} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
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
            ...TYP.caption, color: C.gray400, margin: `${SP.xxs} 0 0`, letterSpacing: '0.04em',
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
              background: isSelected ? DST.activeBg : C.white,
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
        <p style={{ ...TYP.caption, color: C.gray400, margin: `${SP.xxs} 0 0` }}>
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
                    <p style={{ fontFamily: FONT, fontSize: 11, color: C.gray400, margin: `${SP.xxs} 0 0` }}>
                      {cov.description}
                    </p>
                  </div>
                  <span style={{
                    background: C.bannerBg, color: C.successDark,
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
                  <p style={{ fontFamily: FONT, fontSize: 11, color: C.gray300, margin: `${SP.xxs} 0 0` }}>
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
        <p style={{ fontFamily: FONT, fontSize: 17, fontWeight: 700, color: C.white, margin: 0 }}>
          USD {fmt(prima)}
        </p>
      </div>
      <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.15)', margin: '0 20px', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: FONT, fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.55)', margin: '0 0 4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          IVA (19%)
        </p>
        <p style={{ fontFamily: FONT, fontSize: 17, fontWeight: 700, color: C.white, margin: 0 }}>
          USD {fmt(iva)}
        </p>
      </div>
      <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.15)', margin: '0 20px', flexShrink: 0 }} />
      <div style={{ textAlign: 'right' }}>
        <p style={{ fontFamily: FONT, fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.55)', margin: '0 0 4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Total póliza
        </p>
        <p style={{ fontFamily: FONT, fontSize: 24, fontWeight: 800, color: C.white, margin: 0 }}>
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
function SuccessScreen({ onListo, contenedorEnabled = false }) {
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
        borderRadius: '50%',
        background: C.bannerBg,
        border: `3px solid ${C.successLight}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 28, flexShrink: 0,
      }}>
        <svg width="46" height="46" viewBox="0 0 46 46" fill="none" aria-hidden="true">
          <path
            d="M11 23L19.5 31.5L35 15"
            stroke={C.successDark}
            strokeWidth="3.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Título — DS typography.h2 (20px · 600 · 1.4) */}
      <p style={{ ...TYP.h2, color: C.primaryDark, margin: `0 0 ${SP.xs}` }}>
        Carga protegida ✓
      </p>

      {/* Certificados — diferenciados si hay contenedor */}
      {contenedorEnabled ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs, margin: `0 0 ${SP.xl}` }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: SP.xs,
            background: C.white, border: `1px solid ${N[200]}`, borderRadius: BR.xs,
            padding: `${SP.xs} ${SP.ms}`,
          }}>
            <span style={{ ...TYP.body2, color: N[500] }}>Certificado mercancía:</span>
            <span style={{ ...TYP.labelMd, color: C.primaryDark }}>VERT-2025-00847-A</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: SP.xs,
            background: C.white, border: `1px solid ${N[200]}`, borderRadius: BR.xs,
            padding: `${SP.xs} ${SP.ms}`,
          }}>
            <span style={{ ...TYP.body2, color: N[500] }}>Certificado contenedor:</span>
            <span style={{ ...TYP.labelMd, color: C.primaryDark }}>VERT-2025-00847-B</span>
          </div>
          <p style={{ ...TYP.caption, color: N[400], margin: `${SP.xxs} 0 0` }}>
            Vigentes hasta 26 oct 2025 · Los encontrarás en tus documentos
          </p>
        </div>
      ) : (
        <p style={{ ...TYP.body2, color: N[500], margin: `0 0 ${SP.xl}` }}>
          Certificado #VERT-2025-00847 vigente hasta 26 oct 2025. Lo encontrarás en tus documentos
        </p>
      )}

      {/* Botón Listo — DS Button primary */}
      <Button variant="primary" size="medium" onClick={onListo}>
        Listo
      </Button>

      <p style={{ ...TYP.body2, color: N[500], margin: `${SP.xl} 0 0`, maxWidth: 360 }}>
        ¿Trabajas con un agente de carga o broker? Comparte Protege con ellos
      </p>
      <p style={{ ...TYP.body2, color: N[500], margin: `${SP.sm} 0 0`, maxWidth: 360 }}>
        ¿Avisamos cuando llegue tu próxima importación?
      </p>

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
    { value: 'complete', label: 'Valor completo' },
    { value: 'partial',  label: 'Solo una parte' },
  ];

  return (
    <div style={{ padding: SP.md }}>
      {/* Main row: Toggle + number/description + amount/incoterm */}
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm }}>
        <div style={{ flexShrink: 0 }}>
          <Toggle
            checked={invoice.enabled}
            size="small"
            onChange={checked => onUpdate({ ...invoice, enabled: checked, valueMode: 'complete', partialValue: '' })}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ ...TYP.labelMd, color: C.primaryDark, margin: 0 }}>
            {invoice.number}
          </p>
          <p style={{ ...TYP.body2, color: N[500], margin: 0 }}>
            {invoice.description}
          </p>
        </div>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
          gap: SP.xxs, flexShrink: 0,
          opacity: invoice.enabled ? 1 : 0.4, transition: 'opacity 0.15s',
        }}>
          <span style={{ ...TYP.labelMd, color: C.primaryDark }}>
            USD {fmt(invoice.amount)}
          </span>
          <Badge label={invoice.incoterm} variant="neutral" size="small" badgeStyle="light" border={true} />
        </div>
      </div>

      {/* RadioGroup + Input + Alert — visible when toggle ON */}
      {invoice.enabled && (
        <div style={{ paddingTop: SP.sm, paddingLeft: '46px' }}>
          <RadioGroup
            name={`invoice-value-mode-${invoice.id}`}
            options={radioOptions}
            value={invoice.valueMode}
            onChange={mode => onUpdate({ ...invoice, valueMode: mode, partialValue: '' })}
            direction="horizontal"
          />
          {invoice.valueMode === 'partial' && (
            <div style={{ marginTop: SP.sm }}>
              <Input
                label="¿Cuánto quieres asegurar?"
                placeholder="USD 0.00"
                type="number"
                value={invoice.partialValue}
                onChange={e => onUpdate({ ...invoice, partialValue: e.target.value })}
              />
              {partial > 0 && (
                <p style={{ ...TYP.caption, color: N[500], margin: `${SP.xxs} 0 0` }}>
                  Asegurarás USD {partial.toLocaleString('es-CO', { minimumFractionDigits: 0 })} de los USD {fmt(invoice.amount)} de esta factura
                </p>
              )}
            </div>
          )}
          {showAlert && (
            <div style={{ marginTop: SP.sm }}>
              <Alert
                variant="warning"
                alertStyle="border"
                title="Asegurar menos del valor total puede dejarte sin cobertura completa si ocurre un siniestro total"
              />
            </div>
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
        color: bold ? C.primaryDark : N[500],
      }}>
        {label}
      </span>
      <span style={{
        /* bold: DS labelLg (16px·600) — 15px has no DS token; non-bold: DS body2 + medium weight */
        ...(bold ? TYP.labelLg : { ...TYP.body2, fontWeight: 500 }),
        /* DS labelLg (16px) — 15px has no DS token */
        color: bold ? C.primaryDark : N[700],
        whiteSpace: 'nowrap',
      }}>
        {value}
      </span>
    </div>
  );
}

function ResumenPanel({ invTotal, prima, iva, total, fleteVal = 0, arancVal = 0, contenedorPrima = 0 }) {
  const fmt    = n => n.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtInt = n => n.toLocaleString('es-CO', { minimumFractionDigits: 0 });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <p style={{
        ...TYP.caption, fontWeight: 700,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: N[500], margin: `0 0 ${SP.md}`,
      }}>
        Resumen de cobertura
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
        {invTotal > 0 && (
          <ResumenRow label="Mercancía" value={`USD ${fmtInt(invTotal)}`} />
        )}
        {fleteVal > 0 && (
          <ResumenRow label="Flete" value={`+USD ${fmtInt(fleteVal)}`} />
        )}
        {arancVal > 0 && (
          <ResumenRow label="Aranceles" value={`+USD ${fmtInt(arancVal)}`} />
        )}
      </div>

      <div style={{ height: 1, background: N[200], margin: `${SP.ms} 0` }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
        <ResumenRow label="Prima base" value={`USD ${fmt(prima)}`} />
        {contenedorPrima > 0 && (
          <ResumenRow label="Contenedor" value={`+USD ${fmt(contenedorPrima)}`} />
        )}
        <ResumenRow label="IVA"        value={`USD ${fmt(iva)}`} />
      </div>

      <div style={{ height: 1, background: N[200], margin: `${SP.ms} 0` }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ ...TYP.labelMd, color: C.primaryDark }}>Total con IVA incluido</span>
        <span style={{ ...TYP.h2, color: C.primaryDark }}>USD {fmt(total)}</span>
      </div>

      <p style={{
        ...TYP.caption, color: N[400],
        margin: `${SP.ms} 0 0`, lineHeight: 1.5,
      }}>
        La prima equivale al 0.35% del valor asegurado.
      </p>
    </div>
  );
}

// ─── Unified sidebar ──────────────────────────────────────────────────────────
function ResumenSidebar({ coverage, invoices, flete, aranceles, adicCoberturas, pctCoberturas, contenedorPrima = 0 }) {
  const fmt    = n => n.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtInt = n => n.toLocaleString('es-CO', { minimumFractionDigits: 0 });

  const enabledInvoices = invoices.filter(inv => inv.enabled);
  const invTotal = enabledInvoices.reduce((acc, inv) =>
    acc + (inv.valueMode === 'complete' ? inv.amount : (parseFloat(inv.partialValue) || 0)), 0);
  const fleteVal = parseFloat(flete)    || 0;
  const arancVal = parseFloat(aranceles) || 0;
  const totalBase = invTotal + fleteVal + arancVal;

  const lucroAmt  = adicCoberturas.lucro  ? totalBase * ((parseFloat(pctCoberturas.lucro)  || 0) / 100) : 0;
  const gastosAmt = adicCoberturas.gastos ? totalBase * ((parseFloat(pctCoberturas.gastos) || 0) / 100) : 0;
  const totalAsegurado = totalBase + lucroAmt + gastosAmt;

  const primaNeta   = totalAsegurado * 0.0043;
  const iva         = primaNeta * 0.16;
  const totalAPagar = primaNeta + iva + contenedorPrima;

  const coverageLabel = {
    'door-to-door':   'Bodega a bodega',
    'origin-to-door': 'Desde puerto de origen',
    'dest-to-door':   'Desde puerto de destino',
  }[coverage];

  if (enabledInvoices.length === 0 || invTotal === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: 240, padding: SP.lg, textAlign: 'center', gap: SP.sm,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: BR.full, background: N[100],
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L17 5.5V10.5C17 14.2 13.9 17.6 10 18.5C6.1 17.6 3 14.2 3 10.5V5.5L10 2Z"
                  fill="none" stroke={N[300]} strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        </div>
        <p style={{ ...TYP.body2, color: N[400], margin: 0, lineHeight: 1.5 }}>
          Selecciona las facturas para ver el resumen
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <p style={{
        ...TYP.caption, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
        color: N[500], margin: `0 0 ${SP.md}`,
      }}>
        Resumen de cobertura
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>

        {/* 1. Alcance */}
        {coverageLabel && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: SP.xs }}>
            <span style={{ ...TYP.caption, color: N[400], flexShrink: 0 }}>Alcance</span>
            <span style={{ ...TYP.caption, fontWeight: 600, color: C.secondary, textAlign: 'right' }}>
              {coverageLabel}
            </span>
          </div>
        )}

        {/* 2. Facturas */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: SP.xs }}>
          <span style={{ ...TYP.body2, color: N[500] }}>
            {enabledInvoices.length} factura{enabledInvoices.length > 1 ? 's' : ''}
          </span>
          <span style={{ ...TYP.body2, fontWeight: 500, color: N[700] }}>USD {fmtInt(invTotal)}</span>
        </div>

        {/* 3. Flete */}
        {fleteVal > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: SP.xs }}>
            <span style={{ ...TYP.body2, color: N[500] }}>Flete</span>
            <span style={{ ...TYP.body2, fontWeight: 500, color: N[700] }}>+USD {fmtInt(fleteVal)}</span>
          </div>
        )}

        {/* 4. Aranceles */}
        {arancVal > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: SP.xs }}>
            <span style={{ ...TYP.body2, color: N[500] }}>Aranceles</span>
            <span style={{ ...TYP.body2, fontWeight: 500, color: N[700] }}>+USD {fmtInt(arancVal)}</span>
          </div>
        )}

        {/* 5. Lucro cesante */}
        {adicCoberturas.lucro && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: SP.xs }}>
            <span style={{ ...TYP.body2, color: N[500] }}>Lucro cesante</span>
            <span style={{ ...TYP.body2, fontWeight: 500, color: N[700] }}>
              {parseFloat(pctCoberturas.lucro) || 0}% — USD {fmtInt(lucroAmt)}
            </span>
          </div>
        )}

        {/* 6. Gastos adicionales */}
        {adicCoberturas.gastos && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: SP.xs }}>
            <span style={{ ...TYP.body2, color: N[500] }}>Gastos adicionales</span>
            <span style={{ ...TYP.body2, fontWeight: 500, color: N[700] }}>
              {parseFloat(pctCoberturas.gastos) || 0}% — USD {fmtInt(gastosAmt)}
            </span>
          </div>
        )}

      </div>

      {/* 7. Separador */}
      <div style={{ height: 1, background: N[200], margin: `${SP.ms} 0` }} />

      {/* 8. Valor total asegurado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: SP.xs, marginBottom: SP.ms }}>
        <span style={{ ...TYP.labelMd, color: C.primaryDark }}>Valor total asegurado</span>
        <span style={{ ...TYP.labelLg, color: C.primaryDark }}>USD {fmtInt(totalAsegurado)}</span>
      </div>

      {/* 9–11. Costos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: SP.xs }}>
          <span style={{ ...TYP.body2, color: N[500] }}>Prima neta (0.43%)</span>
          <span style={{ ...TYP.body2, fontWeight: 500, color: N[700] }}>USD {fmt(primaNeta)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: SP.xs }}>
          <span style={{ ...TYP.body2, color: N[500] }}>IVA (16%)</span>
          <span style={{ ...TYP.body2, fontWeight: 500, color: N[700] }}>USD {fmt(iva)}</span>
        </div>
        {contenedorPrima > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: SP.xs }}>
            <span style={{ ...TYP.body2, color: N[500] }}>Contenedor</span>
            <span style={{ ...TYP.body2, fontWeight: 500, color: N[700] }}>+USD {fmt(contenedorPrima)}</span>
          </div>
        )}
      </div>

      {/* 12. Total a pagar */}
      <div style={{
        background: C.primary, borderRadius: BR.sm, padding: SP.ms, marginTop: SP.ms,
        display: 'flex', flexDirection: 'column', gap: SP.xxs,
      }}>
        <p style={{
          ...TYP.caption, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.55)', margin: 0,
        }}>
          Total a pagar
        </p>
        <p style={{ ...TYP.h2, color: C.white, margin: 0 }}>
          USD {fmt(totalAPagar)}
        </p>
        <p style={{ ...TYP.caption, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
          IVA incluido
        </p>
      </div>
    </div>
  );
}

// ─── Logística — click-to-edit field ─────────────────────────────────────────
const TIPO_CONT_OPTS = ["20' Dry", "40' Dry", "40' HC", "20' Reefer", "40' Reefer"];

function LogisticField({ fieldKey, label, badgeLabel, badgeVariant = 'success', alwaysEdit = false, editing, setEditing, value, onChange, inputType = 'text', selectOptions = TIPO_CONT_OPTS }) {
  const isEdit = alwaysEdit || editing === fieldKey;
  const editInputStyle = {
    width: '100%', height: 30, border: `1.5px solid ${C.primaryLight}`,
    borderRadius: BR.xxs, padding: `0 ${SP.xs}`,
    fontFamily: FONT, fontSize: '14px', fontWeight: 400,
    color: C.textPrimary, outline: 'none', boxSizing: 'border-box',
    background: C.white,
  };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: SP.sm,
      padding: `${SP.xs} 0`,
      borderBottom: `1px solid ${N[100]}`,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ ...TYP.caption, color: N[400], margin: `0 0 2px` }}>{label}</p>
        {isEdit ? (
          inputType === 'select' ? (
            <select
              autoFocus
              value={value}
              onChange={e => onChange(e.target.value)}
              onBlur={() => setEditing(null)}
              style={{
                ...editInputStyle,
                appearance: 'none', cursor: 'pointer',
                paddingRight: SP.xl,
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%232128B1' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: `right ${SP.xs} center`,
              }}
            >
              {selectOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : (
            <input
              autoFocus={editing === fieldKey}
              value={value}
              onChange={e => onChange(e.target.value)}
              onBlur={() => !alwaysEdit && setEditing(null)}
              onKeyDown={e => { if (e.key === 'Enter' && !alwaysEdit) setEditing(null); }}
              style={editInputStyle}
            />
          )
        ) : (
          <div
            onClick={() => setEditing(fieldKey)}
            style={{ cursor: 'text', display: 'flex', alignItems: 'center', gap: SP.xxs, paddingTop: 2 }}
          >
            <span style={{ ...TYP.body2, color: value ? C.textPrimary : N[300] }}>
              {value || '—'}
            </span>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ color: N[300], flexShrink: 0 }}>
              <path d="M8 2L10 4L4 10H2V8L8 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>
      {badgeLabel && <Badge label={badgeLabel} variant={badgeVariant} size="small" badgeStyle="light" border={true} />}
    </div>
  );
}

const LOGISTIC_FIELDS = [
  { key: 'bl',            label: 'N° BL',                   badge: 'BL',       variant: 'success' },
  { key: 'puertoOrigen',  label: 'Puerto de origen',         badge: 'BL',       variant: 'success' },
  { key: 'puertoDestino', label: 'Puerto de destino',        badge: 'BL',       variant: 'success' },
  { key: 'ciudadDestino', label: 'Ciudad destino',           badge: 'BL',       variant: 'success' },
  { key: 'paisDestino',   label: 'País destino',             badge: 'BL',       variant: 'success' },
  { key: 'pesoTotal',     label: 'Peso estimado (kg)',       badge: 'BL',       variant: 'success' },
  { key: 'descripcion',   label: 'Descripción de mercancía', badge: 'Facturas', variant: 'neutral'  },
];

function InformacionLogistica({ shipmentData, setShipmentData }) {
  const [editing, setEditing] = useState(null);
  function update(key, val) { setShipmentData(prev => ({ ...prev, [key]: val })); }

  return (
    <div style={{ background: C.white, borderRadius: BR.sm, border: `1px solid ${N[200]}`, padding: `0 ${SP.md}` }}>
      {LOGISTIC_FIELDS.map(f => (
        <LogisticField
          key={f.key}
          fieldKey={f.key}
          label={f.label}
          badgeLabel={f.badge}
          badgeVariant={f.variant}
          editing={editing}
          setEditing={setEditing}
          value={shipmentData[f.key] ?? ''}
          onChange={val => update(f.key, val)}
        />
      ))}
      {/* Dirección — always editable */}
      <div style={{ padding: `${SP.xs} 0` }}>
        <p style={{ ...TYP.caption, color: N[400], margin: `0 0 ${SP.xxs}` }}>Dirección de destino</p>
        <input
          value={shipmentData.direccionEntrega ?? ''}
          onChange={e => update('direccionEntrega', e.target.value)}
          placeholder="Ingresa la dirección de entrega"
          style={{
            width: '100%', height: 32, border: `1.5px solid ${N[200]}`,
            borderRadius: BR.xxs, padding: `0 ${SP.xs}`,
            fontFamily: FONT, fontSize: '14px', fontWeight: 400,
            color: C.textPrimary, outline: 'none', boxSizing: 'border-box',
            background: N[50],
          }}
        />
      </div>
    </div>
  );
}

// ─── Step 2 — Main layout ─────────────────────────────────────────────────────

const MERCH_CHIPS = [
  'Pérdida total o robo', 'Daños por accidente',
  'Saqueo y actos de terceros', 'Avería gruesa', 'Operaciones en puerto y bodegas',
];
const CONT_CHIPS = [
  'Daños físicos al contenedor', 'Limpieza ordinaria y extraordinaria', 'Sin deducible en pérdida total',
];

function Step2({ coverage, onCoverageChange, invoices, onUpdateInvoice, contenedorEnabled, setContenedorEnabled, contenedorNombre, setContenedorNombre, contenedorNaviera, setContenedorNaviera, contenedorTipo, setContenedorTipo, flete, setFlete, aranceles, setAranceles, adicCoberturas, setAdicCoberturas, pctCoberturas, setPctCoberturas, paisDestino }) {
  const [containerEditing, setContainerEditing] = useState(null);
  const invTotal = invoices.reduce((acc, inv) => {
    if (!inv.enabled) return acc;
    return acc + (inv.valueMode === 'complete' ? inv.amount : (parseFloat(inv.partialValue) || 0));
  }, 0);
  const fmtInt = n => n.toLocaleString('es-CO', { minimumFractionDigits: 0 });
  const fleteNum    = parseFloat(flete)    || 0;
  const arancNum    = parseFloat(aranceles) || 0;
  const totalInsured = invTotal + fleteNum + arancNum;

  const chevron = (open) => (
    <svg
      width="12" height="12" viewBox="0 0 12 12" fill="none"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', flexShrink: 0 }}
    >
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div style={{
      flex: 1, minHeight: 0, overflowY: 'auto',
      padding: `${SP.xl} 28px ${SP.xl} ${SP.xl}`,
      display: 'flex', flexDirection: 'column', gap: SP.lg,
      background: N[50],
    }}>

        {/* ── Alcance de cobertura ── */}
        <Section title="¿Desde dónde quieres estar cubierto?">
          <CoverageSelector selected={coverage} onChange={onCoverageChange} />
        </Section>

        {/* ── Card A: Mi mercancía ── */}
        <div style={{ background: C.white, borderRadius: BR.sm, border: `1px solid ${N[200]}` }}>

          {/* Header */}
          <div style={{ padding: SP.md }}>
            <p style={{ ...TYP.labelMd, color: C.primaryDark, margin: `0 0 ${SP.xxs}` }}>
              Mi mercancía
            </p>
            <p style={{ ...TYP.body2, color: N[500], margin: 0 }}>
              Protege el valor de tu carga contra pérdida total, robo, saqueo, daños por accidente y averías durante todo el tránsito.
            </p>
          </div>

          {/* Separador header → contenido (token N[200]) */}
          <Divider />

          {/* Label de sección */}
          <p style={{
            ...TYP.caption, fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: N[500], margin: 0, padding: `${SP.xs} ${SP.md}`,
          }}>
            ¿Qué quieres proteger?
          </p>

          {/* Filas de facturas */}
          {invoices.map((inv, idx) => (
            <div key={inv.id}>
              <div style={{ height: 1, background: N[200] }} />
              <InvoiceCard
                invoice={inv}
                onUpdate={updated => onUpdateInvoice(inv.id, updated)}
              />
            </div>
          ))}

          {/* Fila total */}
          <div style={{ height: 1, background: N[200] }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: SP.md }}>
            <span style={{ ...TYP.body2, color: N[500] }}>Total mercancía seleccionada</span>
            <span style={{ ...TYP.labelMd, color: C.primaryDark }}>USD {fmtInt(invTotal)}</span>
          </div>
        </div>

        {/* ── Flete y aranceles ── */}
        <div style={{ background: C.white, borderRadius: BR.sm, border: `1px solid ${N[200]}`, padding: SP.md }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SP.ms }}>
            <Input
              label="Flete estimado (USD)"
              placeholder="Ej. 3,200"
              type="number"
              value={flete}
              onChange={e => setFlete(e.target.value)}
              helperText="Puedes omitirlo si no lo tienes"
            />
            <Input
              label="Aranceles / impuestos (USD)"
              placeholder="Ej. 4,500"
              type="number"
              value={aranceles}
              onChange={e => setAranceles(e.target.value)}
            />
          </div>
        </div>

        {/* ── Contenedor (sección colapsable) ── */}
        <div style={{ background: C.white, borderRadius: BR.sm, border: `1px solid ${N[200]}` }}>

          {/* Header: toggle + título + subtítulo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, padding: SP.md }}>
            <div style={{ flexShrink: 0 }}>
              <Toggle
                checked={contenedorEnabled}
                size="small"
                onChange={checked => setContenedorEnabled(checked)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ ...TYP.labelMd, color: C.primaryDark, margin: 0 }}>
                Asegurar contenedor
              </p>
              <p style={{ ...TYP.body2, color: N[500], margin: 0 }}>
                Cubre cargos por daño o limpieza del contenedor
              </p>
            </div>
          </div>

          {/* Contenido expandible */}
          <div style={{
            overflow: 'hidden',
            maxHeight: contenedorEnabled ? '320px' : '0',
            transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1)',
          }}>
            <div style={{
              borderTop: `1px solid ${N[200]}`,
              padding: `0 ${SP.md} ${SP.md}`,
              display: 'flex', flexDirection: 'column', gap: SP.sm,
            }}>
              <LogisticField
                fieldKey="nombre"
                label="Nombre del contenedor"
                badgeLabel="BL"
                editing={containerEditing}
                setEditing={setContainerEditing}
                value={contenedorNombre}
                onChange={val => setContenedorNombre(val)}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SP.ms }}>
                <LogisticField
                  fieldKey="naviera"
                  label="Naviera"
                  badgeLabel="BL"
                  editing={containerEditing}
                  setEditing={setContainerEditing}
                  value={contenedorNaviera}
                  onChange={val => setContenedorNaviera(val)}
                />
                <LogisticField
                  fieldKey="tipo"
                  label="Tipo de contenedor"
                  badgeLabel="BL"
                  editing={containerEditing}
                  setEditing={setContainerEditing}
                  value={contenedorTipo}
                  onChange={val => setContenedorTipo(val)}
                  inputType="select"
                />
              </div>
              <Alert
                variant="warning"
                alertStyle="border"
                description="Genera un certificado separado."
              />
            </div>
          </div>
        </div>

        {/* ── Coberturas adicionales ── */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
          <p style={{ ...TYP.h3, color: N[700], margin: 0 }}>
            ¿Quieres agregar algo más a tu cobertura?
          </p>
          <p style={{ ...TYP.body2, color: N[500], margin: 0 }}>
            Activa las protecciones extra que necesites. Puedes desactivarlas si no aplican.
          </p>
          <div style={{
            background: C.white, borderRadius: BR.sm, border: `1px solid ${N[200]}`,
            padding: `0 ${SP.lg}`,
          }}>
            {STEP3_STANDARD.map((cov, i) => (
              <div key={cov.key}>
                {i > 0 && <div style={{ height: 1, background: C.gray200 }} />}
                <CoverageToggleRow
                  cov={cov}
                  enabled={adicCoberturas[cov.key]}
                  onToggle={checked => setAdicCoberturas(prev => ({ ...prev, [cov.key]: checked }))}
                  pct={pctCoberturas[cov.key]}
                  onPctChange={val => setPctCoberturas(prev => ({ ...prev, [cov.key]: val }))}
                  totalInsured={totalInsured}
                />
              </div>
            ))}
            {!['México', 'Colombia'].includes(paisDestino) && (
              <>
                <div style={{ height: 1, background: C.gray200 }} />
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
              </>
            )}
          </div>
        </section>


    </div>
  );
}

// ─── Step 3 — Coverage toggle row ────────────────────────────────────────────
function CoverageToggleRow({ cov, enabled, onToggle, disabled = false, pct, onPctChange, totalInsured = 0 }) {
  const pctNum = parseFloat(pct) || 0;
  const usdVal = totalInsured * (pctNum / 100);
  const fmtInt = n => n.toLocaleString('es-CO', { minimumFractionDigits: 0 });

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      gap: SP.ms, padding: `${SP.ms} 0`,
    }}>
      <div style={{ flex: 1 }}>
        <p style={{
          ...TYP.labelMd,
          color: disabled ? N[400] : C.primaryDark, margin: 0,
        }}>
          {cov.label}
        </p>
        {cov.description && (
          <p style={{
            ...TYP.body2, color: disabled ? N[400] : N[500],
            margin: `${SP.xxs} 0 0`,
          }}>
            {cov.description}
          </p>
        )}

        {/* Percentage input — visible only when toggle ON and has handler */}
        {enabled && !disabled && onPctChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: SP.xs, marginTop: SP.sm, flexWrap: 'wrap' }}>
            <input
              type="number"
              value={pct}
              onChange={e => onPctChange(e.target.value)}
              min="0" max="100" step="1"
              style={{
                width: 70, height: 32, padding: `0 ${SP.xs}`,
                border: `1.5px solid ${N[200]}`, borderRadius: BR.xs,
                fontFamily: FONT, fontSize: '14px', fontWeight: 400,
                color: C.textPrimary, outline: 'none', boxSizing: 'border-box',
              }}
            />
            <span style={{ ...TYP.body2, color: N[500] }}>% del valor asegurado</span>
            <span style={{ ...TYP.labelMd, color: C.primaryDark }}>= USD {fmtInt(usdVal)}</span>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexShrink: 0 }}>
        {disabled && (
          <span style={{
            background: N[100], color: N[400],
            borderRadius: BR.md, padding: `3px ${SP.xs}`,
            ...TYP.caption, fontWeight: 600, whiteSpace: 'nowrap',
          }}>
            No aplica
          </span>
        )}
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
function ResumenPanelStep3({ baseInvoices, fleteVal, arancVal, prima, coberturas, pctCoberturas, adicExtra, contenedorPrima = 0, iva, total }) {
  const fmt    = n => n.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtInt = n => n.toLocaleString('es-CO', { minimumFractionDigits: 0 });

  const totalInsured = baseInvoices + fleteVal + arancVal;
  const lucroAmt  = coberturas.lucro  ? totalInsured * ((parseFloat(pctCoberturas?.lucro)  || 0) / 100) : 0;
  const gastosAmt = coberturas.gastos ? totalInsured * ((parseFloat(pctCoberturas?.gastos) || 0) / 100) : 0;

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
      <ResumenRow label="Prima base" value={`USD ${fmt(prima)}`} />
      {coberturas.lucro  && <ResumenRow label="Lucro cesante"      value={`+USD ${fmt(lucroAmt)}`} />}
      {coberturas.gastos && <ResumenRow label="Gastos adicionales" value={`+USD ${fmt(gastosAmt)}`} />}
      {contenedorPrima > 0 && <ResumenRow label="Contenedor" value={`+USD ${fmt(contenedorPrima)}`} />}
      <ResumenRow label="IVA" value={`USD ${fmt(iva)}`} />

      <div style={{ height: 1, background: N[200], margin: `${SP.ms} 0` }} />

      <ResumenRow label="Total con IVA incluido" value={`USD ${fmt(total)}`} bold />

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
function Step3({ invoices, flete, aranceles, coberturas, setCoberturas, paisDestino, pctCoberturas, setPctCoberturas }) {
  const baseInvoices = invoices.reduce((acc, inv) => {
    if (!inv.enabled) return acc;
    return acc + (inv.valueMode === 'complete' ? inv.amount : (parseFloat(inv.partialValue) || 0));
  }, 0);
  const fleteVal     = parseFloat(flete)    || 0;
  const arancVal     = parseFloat(aranceles) || 0;
  const totalInsured = baseInvoices + fleteVal + arancVal;

  return (
    <div style={{
      flex: 1, minHeight: 0, overflowY: 'auto',
      padding: `${SP.xl} 28px ${SP.xl} ${SP.xl}`,
      display: 'flex', flexDirection: 'column', gap: SP.lg,
      background: N[50],
    }}>

        {/* Bloque: Coberturas adicionales */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
          {/* DS typography.h3 — 16px·600·1.4 */}
          <p style={{ ...TYP.h3, color: N[700], margin: 0 }}>
            ¿Quieres agregar algo más a tu cobertura?
          </p>
          <p style={{ ...TYP.body2, color: N[500], margin: 0 }}>
            Activa las protecciones extra que necesites para tu operación. Puedes desactivarlas si no aplican.
          </p>

          {/* Tarjeta agrupadora */}
          <div style={{
            background: C.white,
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
                  pct={pctCoberturas[cov.key]}
                  onPctChange={val => setPctCoberturas(prev => ({ ...prev, [cov.key]: val }))}
                  totalInsured={totalInsured}
                />
              </div>
            ))}

            {!['México', 'Colombia'].includes(paisDestino) && (
              <>
                {/* Separador DS */}
                <div style={{ height: 1, background: C.gray200 }} />

                {/* Coberturas deshabilitadas — solo visibles fuera de México */}
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
              </>
            )}
          </div>
        </section>
    </div>
  );
}

// ─── Step 4 — Initial shipment data ──────────────────────────────────────────
const SHIPMENT_INIT = {
  bl:                  'MSCUGF123456',
  puertoOrigen:        'Puerto de Shanghai, CN',
  puertoDestino:       'Puerto de Cartagena, CO',
  incoterm:            'CIF',
  pesoTotal:           '2,450',
  paisDestino:         'Colombia',
  ciudadDestino:       'Bogotá',
  descripcion:         'Maquinaria industrial de perforación y herramientas',
  posicionArancelaria: '8479.89.99',
  direccionEntrega:    'Cra. 7 No. 71-21, Usaquén, Bogotá',
};

// ─── Step 4 — Resumen panel (reusa ResumenRow) ────────────────────────────────
function ResumenPanelStep4({ totalInsured, prima, adicExtra, contenedorPrima = 0, iva, total }) {
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
        <ResumenRow label="Prima base"    value={`USD ${fmt(prima)}`} />
        {adicExtra > 0 && (
          <ResumenRow label="Coberturas adicionales" value={`+USD ${fmt(adicExtra)}`} />
        )}
        {contenedorPrima > 0 && (
          <ResumenRow label="Contenedor" value={`+USD ${fmt(contenedorPrima)}`} />
        )}
        <ResumenRow label="IVA"             value={`USD ${fmt(iva)}`} />
      </div>

      <div style={{ height: 1, background: N[200], margin: `${SP.ms} 0` }} />

      <ResumenRow label="Total con IVA incluido" value={`USD ${fmt(total)}`} bold />

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
function Step4({ shipmentData, setShipmentData }) {
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
    <div style={{
      flex: 1, minHeight: 0, overflowY: 'auto',
      padding: `${SP.xl} 28px ${SP.xl} ${SP.xl}`,
      display: 'flex', flexDirection: 'column', gap: SP.lg,
      background: N[50],
    }}>

        {/* Encabezado descriptivo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
          <p style={{ ...TYP.h3, color: N[700], margin: 0 }}>
            Revisa los datos de tu operación
          </p>
          <p style={{ ...TYP.body2, color: N[500], margin: 0 }}>
            Usaremos esta información para emitir tu certificado. Confirma que todo coincida con tu BL y factura comercial
          </p>

          {/* Sello de verificación — DS Badge con ícono check custom */}
          <div style={{ display: 'inline-flex' }}>
            <Badge
              label="Confirmado desde tu BL"
              variant="success"
              size="medium"
              badgeStyle="light"
              border={true}
              showIconLeft={true}
              icon={<CheckIcon />}
            />
          </div>
        </div>

        {/* Alert informativo — DS Alert info */}
        <Alert
          variant="info"
          alertStyle="border"
          description="Estos datos van directo a la aseguradora. Edita cualquier campo que no coincida con tu documentación aduanera"
        />

        {/* Grid de campos — tarjeta agrupadora */}
        <div style={{
          background: C.white,
          borderRadius: BR.sm,
          border: `1px solid ${N[200]}`,
          padding: SP.lg,
          display: 'flex', flexDirection: 'column', gap: SP.md,
        }}>

          {/* Fila 1: Puerto de origen · Incoterm · Peso total */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: SP.ms }}>
            <Input
              label="Puerto de origen"
              placeholder="Ej: CNSHG — Puerto de Shanghái"
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
              placeholder="Ej: Bogotá"
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
            placeholder="Ej: Maquinaria industrial de perforación"
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
function Step5({ coverage, invoices, contenedorEnabled, contenedorCount, contenedorValue, flete, aranceles, adicCoberturas, pctCoberturas, contenedorPrima = 0 }) {
  const fmt    = n => n.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtInt = n => n.toLocaleString('es-CO', { minimumFractionDigits: 0 });

  const baseInvoices = invoices.reduce((acc, inv) => {
    if (!inv.enabled) return acc;
    return acc + (inv.valueMode === 'complete' ? inv.amount : (parseFloat(inv.partialValue) || 0));
  }, 0);
  const fleteVal     = parseFloat(flete)     || 0;
  const arancVal     = parseFloat(aranceles)  || 0;
  const totalInsured = baseInvoices + fleteVal + arancVal;
  const lucroAmt     = adicCoberturas.lucro  ? totalInsured * ((parseFloat(pctCoberturas.lucro)  || 0) / 100) : 0;
  const gastosAmt    = adicCoberturas.gastos ? totalInsured * ((parseFloat(pctCoberturas.gastos) || 0) / 100) : 0;
  const totalAsegurado = totalInsured + lucroAmt + gastosAmt;
  const primaNeta    = totalAsegurado * 0.0043;
  const iva          = primaNeta * 0.16;
  const total        = primaNeta + iva + contenedorPrima;
  const numCont      = parseInt(contenedorCount) || 0;
  const valCont      = parseFloat(contenedorValue) || 0;

  const coverageLabel = {
    'door-to-door':   'Bodega a bodega',
    'origin-to-door': 'Desde puerto de origen',
    'dest-to-door':   'Desde puerto de destino',
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
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

      {/* ── Columna izquierda ── */}
      <div style={{
        flex: 1, minHeight: 0, overflowY: 'auto',
        padding: SP.xl,
        background: N[50],
        display: 'flex', flexDirection: 'column', gap: SP.lg,
      }}>

      {/* Encabezado — DS h3 */}
      <p style={{ ...TYP.h3, color: N[700], margin: 0, maxWidth: 680 }}>
        Esto es lo que estás contratando
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
          background: C.white,
          borderRadius: BR.sm,
          border: `1px solid ${C.gray200}`,
          overflow: 'hidden',
        }}>
          {/* Card header */}
          <div style={{ padding: `${SP.ms} ${SP.lg}`, borderBottom: `1px solid ${C.gray200}` }}>
            <p style={{ ...TYP.labelLg, color: C.primaryDark, margin: 0 }}>Resumen de cobertura</p>
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
                    <p style={{ ...TYP.caption, color: N[400], margin: `${SP.xxs} 0 0`, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {inv.description}
                    </p>
                  </div>
                  <p style={{ ...TYP.labelMd, color: C.primaryDark, margin: 0, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    USD {fmtInt(val)}
                  </p>
                </div>
              );
            })}

            {/* Contenedor */}
            {contenedorEnabled && numCont > 0 && (
              <>
                <CardSectionLabel>Contenedor</CardSectionLabel>
                <SummaryRow
                  topBorder={false}
                  label={`${numCont} contenedor${numCont > 1 ? 'es' : ''}`}
                  valueNode={
                    valCont > 0
                      ? <p style={{ ...TYP.labelMd, color: C.primaryDark, margin: 0 }}>USD {fmtInt(numCont * valCont)}</p>
                      : <Badge label="Sin valor" variant="neutral" size="small" badgeStyle="light" border={true} />
                  }
                />
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
                    valueNode={<p style={{ ...TYP.labelMd, color: C.primaryDark, margin: 0 }}>USD {fmtInt(fleteVal)}</p>}
                  />
                )}
                {arancVal > 0 && (
                  <SummaryRow
                    topBorder={fleteVal > 0}
                    label="Aranceles / impuestos"
                    valueNode={<p style={{ ...TYP.labelMd, color: C.primaryDark, margin: 0 }}>USD {fmtInt(arancVal)}</p>}
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
                    valueNode={<Badge label={`+USD ${fmtInt(lucroAmt)}`} variant="success" size="small" badgeStyle="light" border={true} />}
                  />
                )}
                {adicCoberturas.gastos && (
                  <SummaryRow
                    topBorder={adicCoberturas.lucro}
                    label="Gastos adicionales"
                    valueNode={<Badge label={`+USD ${fmtInt(gastosAmt)}`} variant="success" size="small" badgeStyle="light" border={true} />}
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
              <p style={{ ...TYP.h3, color: C.primaryDark, margin: 0 }}>USD {fmtInt(totalInsured)}</p>
            </div>

          </div>
        </div>

        {/* ── Columna derecha: costo final ── */}
        <div style={{
          background: C.white,
          borderRadius: BR.sm,
          border: `1px solid ${C.gray200}`,
          overflow: 'hidden',
        }}>
          {/* Card header */}
          <div style={{ padding: `${SP.ms} ${SP.lg}`, borderBottom: `1px solid ${C.gray200}` }}>
            <p style={{ ...TYP.labelLg, color: C.primaryDark, margin: 0 }}>Costo de la póliza</p>
          </div>

          <div style={{ padding: SP.lg }}>

            {contenedorEnabled && contenedorPrima > 0 ? (
              <>
                {/* ── Sección Mercancía ── */}
                <p style={{ ...TYP.labelSm, color: N[400], textTransform: 'uppercase', letterSpacing: '0.07em', margin: `0 0 ${SP.sm}` }}>
                  Mercancía
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: SP.xs }}>
                    <p style={{ ...TYP.body2, color: N[500], margin: 0 }}>Valor asegurado</p>
                    <p style={{ ...TYP.labelMd, color: N[700], margin: 0, whiteSpace: 'nowrap' }}>USD {fmtInt(totalAsegurado)}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: SP.xs }}>
                    <p style={{ ...TYP.body2, color: N[500], margin: 0 }}>Prima neta (0.43%)</p>
                    <p style={{ ...TYP.labelMd, color: N[700], margin: 0, whiteSpace: 'nowrap' }}>USD {fmt(primaNeta)}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: SP.xs }}>
                    <p style={{ ...TYP.body2, color: N[500], margin: 0 }}>IVA (16%)</p>
                    <p style={{ ...TYP.labelMd, color: N[700], margin: 0, whiteSpace: 'nowrap' }}>USD {fmt(iva)}</p>
                  </div>
                </div>

                <div style={{ height: 1, background: N[200], margin: `${SP.ms} 0` }} />

                {/* ── Sección Contenedor ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SP.sm }}>
                  <p style={{ ...TYP.labelSm, color: N[400], textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>
                    Contenedor
                  </p>
                  <Badge label="Certificado independiente" variant="warning" size="small" badgeStyle="light" border={true} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: SP.xs }}>
                    <p style={{ ...TYP.body2, color: N[500], margin: 0 }}>Valor asegurado</p>
                    <p style={{ ...TYP.labelMd, color: N[700], margin: 0, whiteSpace: 'nowrap' }}>USD {fmtInt(numCont * valCont)}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: SP.xs }}>
                    <p style={{ ...TYP.body2, color: N[500], margin: 0 }}>Prima (0.43%)</p>
                    <p style={{ ...TYP.labelMd, color: N[700], margin: 0, whiteSpace: 'nowrap' }}>USD {fmt(contenedorPrima)}</p>
                  </div>
                </div>

                <div style={{ height: 1, background: N[200], margin: `${SP.ms} 0` }} />

                {/* ── Total consolidado ── */}
                <p style={{ ...TYP.labelSm, color: N[400], textTransform: 'uppercase', letterSpacing: '0.07em', margin: `0 0 ${SP.xxs}` }}>
                  Total consolidado
                </p>
                <p style={{ ...TYP.h1, color: C.primary, margin: 0 }}>
                  USD {fmt(total)}
                </p>
                <p style={{ ...TYP.caption, color: N[400], margin: `${SP.xxs} 0 0` }}>
                  IVA incluido
                </p>
              </>
            ) : (
              <>
                {/* ── Layout sin contenedor ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, marginBottom: SP.lg }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: SP.xs }}>
                    <p style={{ ...TYP.body2, color: N[500], margin: 0 }}>Prima neta (0.43%)</p>
                    <p style={{ ...TYP.labelMd, color: N[700], margin: 0, whiteSpace: 'nowrap' }}>USD {fmt(primaNeta)}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: SP.xs }}>
                    <p style={{ ...TYP.body2, color: N[500], margin: 0 }}>IVA (16%)</p>
                    <p style={{ ...TYP.labelMd, color: N[700], margin: 0, whiteSpace: 'nowrap' }}>USD {fmt(iva)}</p>
                  </div>
                </div>

                <div style={{ height: 1, background: C.gray200, marginBottom: SP.lg }} />

                <div style={{ marginBottom: SP.xxs }}>
                  <p style={{ ...TYP.labelSm, color: N[400], textTransform: 'uppercase', letterSpacing: '0.07em', margin: `0 0 ${SP.xxs}` }}>
                    Total con IVA incluido
                  </p>
                  <p style={{ ...TYP.h1, color: C.primary, margin: 0 }}>
                    USD {fmt(total)}
                  </p>
                  <p style={{ ...TYP.caption, color: N[400], margin: `${SP.xxs} 0 0` }}>
                    IVA incluido
                  </p>
                </div>
              </>
            )}

          </div>
        </div>

      </div>

      {/* Subtítulo paso 4 */}
      <p style={{ ...TYP.body2, color: N[500], margin: 0 }}>
        Revisa el detalle antes de emitir. Una vez confirmado, recibirás el certificado por correo y quedará disponible en tus documentos
      </p>

      </div>

    </div>
  );
}

// ─── Step Bar ─────────────────────────────────────────────────────────────────
// Colors mapeados desde tokens del design system (tokens.ts)
const DS_STEP = {
  active:      C.secondary,
  done:        C.successMain,
  inactiveBg:  C.white,
  inactiveBdr: N[200],
  labelActive: C.secondary,
  labelInact:  N[500],
  white:       C.white,
  border:      N[200],
};

const WIZARD_STEPS = ['Cobertura', 'Confirmar'];
const CIRCLE_SIZE  = 28; // px
const CONNECTOR_TOP = CIRCLE_SIZE / 2; // 14px — alinea al centro del círculo

function StepBar({ activeStep }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start',
      padding: `${SP.ms} ${SP.xl} ${SP.sm}`,
      borderBottom: `1px solid ${DS_STEP.border}`,
      flexShrink: 0, background: C.white,
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
              marginTop: SP.xxs,
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
  const [coverage, setCoverage]               = useState(null);
  const [invoices, setInvoices]               = useState(INVOICES_INIT);
  const [contenedorEnabled, setContenedorEnabled] = useState(false);
  const [contenedorNombre, setContenedorNombre]   = useState('TCKU3456789');
  const [contenedorNaviera, setContenedorNaviera] = useState('Evergreen');
  const [contenedorTipo, setContenedorTipo]       = useState("40' HC");
  const [flete, setFlete]                     = useState('');
  const [aranceles, setAranceles]             = useState('');
  const [adicCoberturas, setAdicCoberturas]   = useState({ lucro: true, gastos: true });
  const [pctCoberturas, setPctCoberturas]     = useState({ lucro: 10, gastos: 5 });
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

  // Total for step-4 CTA label (same calculation as ResumenSidebar)
  const _baseInv         = invoices.reduce((acc, inv) => !inv.enabled ? acc : acc + (inv.valueMode === 'complete' ? inv.amount : (parseFloat(inv.partialValue) || 0)), 0);
  const _totalBase       = _baseInv + (parseFloat(flete) || 0) + (parseFloat(aranceles) || 0);
  const _lucroAmt        = adicCoberturas.lucro  ? _totalBase * ((parseFloat(pctCoberturas.lucro)  || 0) / 100) : 0;
  const _gastosAmt       = adicCoberturas.gastos ? _totalBase * ((parseFloat(pctCoberturas.gastos) || 0) / 100) : 0;
  const _totalAsegurado  = _totalBase + _lucroAmt + _gastosAmt;
  const _primaNeta       = _totalAsegurado * 0.0043;
  const _ivaModal        = _primaNeta * 0.16;
  const _contenedorPrima = 0;
  const _modalTotal      = _primaNeta + _ivaModal + _contenedorPrima;
  const _fmtTotal        = _modalTotal.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.gray100 }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: SP.ms,
        padding: `${SP.ms} ${SP.xl}`, borderBottom: `1px solid ${C.gray200}`,
        flexShrink: 0, background: C.white,
      }}>
        <button onClick={handleClose} style={{
          display: 'flex', alignItems: 'center', gap: SP.xxs,
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
            <p style={{ ...TYP.labelLg, color: C.primary, margin: 0 }}>
              Protege tu mercancía
            </p>
            <p style={{ ...TYP.caption, color: C.gray400, margin: `${SP.xxs} 0 0` }}>
              Configura los detalles de tu póliza
            </p>
          </div>
        </div>
      </div>

      {/* ── Step Bar ── */}
      {!emitted && <StepBar activeStep={step} />}

      {/* ── Body ── */}
      {emitted ? (
        <SuccessScreen onListo={handleListo} contenedorEnabled={contenedorEnabled} />
      ) : step === 2 ? (
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* ── Left: logistics review ── */}
          <div style={{
            flex: 1, minHeight: 0, overflowY: 'auto',
            padding: `${SP.xl} 28px ${SP.xl} ${SP.xl}`,
            display: 'flex', flexDirection: 'column', gap: SP.lg,
            background: N[50],
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
              <p style={{ ...TYP.h3, color: N[700], margin: 0 }}>Revisa los datos de tu operación</p>
              <p style={{ ...TYP.body2, color: N[500], margin: 0 }}>
                Confirma que todo coincida con tu BL y documentación aduanera.
              </p>
            </div>
            <Section title="Información logística">
              <InformacionLogistica shipmentData={shipmentData} setShipmentData={setShipmentData} />
            </Section>
          </div>
          {/* ── Right: summary sidebar ── */}
          <div style={{
            width: 288, flexShrink: 0,
            borderLeft: `1px solid ${N[200]}`,
            background: C.white,
            overflowY: 'auto',
            padding: `${SP.xl} ${SP.lg}`,
          }}>
            <ResumenSidebar
              coverage={coverage}
              invoices={invoices}
              flete={flete}
              aranceles={aranceles}
              adicCoberturas={adicCoberturas}
              pctCoberturas={pctCoberturas}
              contenedorPrima={_contenedorPrima}
            />
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* ── Left column: step 1 ── */}
          <Step2
            coverage={coverage}
            onCoverageChange={id => setCoverage(id)}
            invoices={invoices}
            onUpdateInvoice={handleUpdateInvoice}
            contenedorEnabled={contenedorEnabled}
            setContenedorEnabled={setContenedorEnabled}
            contenedorNombre={contenedorNombre}
            setContenedorNombre={setContenedorNombre}
            contenedorNaviera={contenedorNaviera}
            setContenedorNaviera={setContenedorNaviera}
            contenedorTipo={contenedorTipo}
            setContenedorTipo={setContenedorTipo}
            flete={flete}
            setFlete={setFlete}
            aranceles={aranceles}
            setAranceles={setAranceles}
            adicCoberturas={adicCoberturas}
            setAdicCoberturas={setAdicCoberturas}
            pctCoberturas={pctCoberturas}
            setPctCoberturas={setPctCoberturas}
            paisDestino={shipmentData.paisDestino}
          />
          {/* ── Right panel: persistent sidebar ── */}
          <div style={{
            width: 288, flexShrink: 0,
            borderLeft: `1px solid ${N[200]}`,
            background: C.white,
            overflowY: 'auto',
            padding: `${SP.xl} ${SP.lg}`,
          }}>
            <ResumenSidebar
              coverage={coverage}
              invoices={invoices}
              flete={flete}
              aranceles={aranceles}
              adicCoberturas={adicCoberturas}
              pctCoberturas={pctCoberturas}
              contenedorPrima={_contenedorPrima}
            />
          </div>
        </div>
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
          display: 'flex', justifyContent: 'space-between',
          padding: `${SP.ms} ${SP.xl}`, borderTop: `1px solid ${C.gray200}`,
          flexShrink: 0, background: C.white,
        }}>
          <Button variant="secondary" size="medium" onClick={() => setStep(1)}>
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
            fill="none" stroke={C.successDark} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M7 10l2 2 4-4" stroke={C.successDark} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CalendarCheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="3" width="14" height="13" rx="2" stroke={C.successDark} strokeWidth="1.4"/>
      <path d="M2 7h14" stroke={C.successDark} strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M6 1v3M12 1v3" stroke={C.successDark} strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M6 11l2 2 4-3.5" stroke={C.successDark} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ShieldSmallIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M7.5 1.5L13 4.5V8.5C13 11.5 10.5 14 7.5 14.5C4.5 14 2 11.5 2 8.5V4.5L7.5 1.5Z"
            fill="none" stroke={C.white} strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M5 7.5l2 2 3.5-3.5" stroke={C.white} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
