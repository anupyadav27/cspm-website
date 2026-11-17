# Run from public/images/products: python3 ../../../scripts/generate-product-drawings.py
# Flat console-style mock screen for the Onam AI tab (Estate/FinOps drawings retired 17 Nov 2026).
F='font-family="Inter, -apple-system, Segoe UI, Helvetica, Arial, sans-serif"'
def frame(title, chip, body, accent):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420" {F}>
<rect width="640" height="420" fill="#F7F9FC"/>
<rect x="28" y="28" width="584" height="364" rx="8" fill="#FFFFFF" stroke="#E5E9F0"/>
<rect x="28" y="28" width="584" height="44" rx="8" fill="#FFFFFF"/>
<line x1="28" y1="72" x2="612" y2="72" stroke="#E5E9F0"/>
<text x="48" y="56" font-size="15" font-weight="700" fill="#0B1220">{title}</text>
<rect x="{60+len(title)*8.2}" y="41" width="{len(chip)*6.1+14}" height="20" rx="4" fill="#FFFFFF" stroke="{accent}" stroke-opacity=".45"/>
<text x="{68+len(title)*8.2}" y="55" font-size="11" font-weight="600" fill="{accent}">{chip}</text>
{body}
</svg>'''

def table(cols, xs, rows, y0=92):
    out=[f'<rect x="29" y="{y0-2}" width="582" height="28" fill="#F8FAFC"/>']
    for c,x in zip(cols,xs):
        out.append(f'<text x="{x}" y="{y0+16}" font-size="10" font-weight="600" fill="#64748B" letter-spacing=".6">{c}</text>')
    y=y0+26
    for r in rows:
        out.append(f'<line x1="29" y1="{y}" x2="611" y2="{y}" stroke="#EEF1F5"/>')
        for cell,x in zip(r,xs):
            if isinstance(cell,tuple):
                txt,col=cell
                w=len(txt)*6.2+14
                out.append(f'<rect x="{x}" y="{y+9}" width="{w}" height="18" rx="4" fill="{col}" fill-opacity=".1"/><text x="{x+7}" y="{y+22}" font-size="10.5" font-weight="600" fill="{col}">{txt}</text>')
            else:
                out.append(f'<text x="{x}" y="{y+22}" font-size="12" fill="#0B1220">{cell}</text>')
        y+=36
    return "\n".join(out)

onam_ai=frame("Suggested fixes","3 waiting",table(
 ["SUGGESTED FIX","AREA","EVIDENCE","STATUS"],[48,290,410,510],
 [["Block public access on customer-exports","Security","4 findings",("Waiting","#B45309")],
  ["Remove unused admin role ops-legacy","Security","90 days idle",("Waiting","#B45309")],
  ["Restrict bucket policy on audit-logs","Data","1 finding",("Waiting","#B45309")],
  ["Rotate key ci-deploy-key","Security","key age 420 d",("Approved","#059669")],
  ["Close port 22 on bastion-old","Security","2 findings",("Rejected","#64748B")]]),"#4F46E5")
for n,s in [("onam-ai",onam_ai)]:
    open(f"{n}.svg","w").write(s)
