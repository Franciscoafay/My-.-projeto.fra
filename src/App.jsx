import React, { useEffect, useMemo, useRef, useState } from "react";
import Logo from "./assets/logo.svg?url";

const STORAGE = "trabalhos_pdf_v2_v1";

export default function App(){
  const [titulo, setTitulo] = useState("Perspetiva Sociológica do Conhecimento");
  const [autor, setAutor] = useState("");
  const [turma, setTurma] = useState("");
  const [dataDoc, setDataDoc] = useState(new Date().toLocaleDateString());
  const [indice, setIndice] = useState([
    "Capa",
    "Introdução",
    "1. Conceitos-chave",
    "2. Abordagens Filosóficas",
    "3. Perspectiva Fenomenológica",
    "4. Exemplos e Implicações",
    "Conclusão",
    "Referências"
  ].join("\n"));
  const [introducao, setIntroducao] = useState("Este trabalho apresenta uma visão geral da sociologia do conhecimento, explorando conceitos, tradições filosóficas e a fenomenologia.");
  const [desenvolvimento, setDesenvolvimento] = useState(generateLongFilosofia());
  const [conclusao, setConclusao] = useState("Conclui-se que o conhecimento é socialmente situado e estabilizado por práticas, instituições e linguagens.");
  const [referencias, setReferencias] = useState("Berger & Luckmann (1966). A construção social da realidade.\nHusserl (1913). Ideias para uma fenomenologia pura.");
  const [theme, setTheme] = useState("light");

  useEffect(()=>{
    try{
      const raw = localStorage.getItem(STORAGE);
      if(raw){
        const data = JSON.parse(raw);
        if(data) {
          setTitulo(data.titulo ?? titulo);
          setAutor(data.autor ?? autor);
          setTurma(data.turma ?? turma);
          setDataDoc(data.dataDoc ?? dataDoc);
          setIndice(data.indice ?? indice);
          setIntroducao(data.introducao ?? introducao);
          setDesenvolvimento(data.desenvolvimento ?? desenvolvimento);
          setConclusao(data.conclusao ?? conclusao);
          setReferencias(data.referencias ?? referencias);
          setTheme(data.theme ?? theme);
        }
      }
    }catch(e){}
  },[]);

  useEffect(()=>{
    const payload = { titulo, autor, turma, dataDoc, indice, introducao, desenvolvimento, conclusao, referencias, theme };
    localStorage.setItem(STORAGE, JSON.stringify(payload));
  },[titulo,autor,turma,dataDoc,indice,introducao,desenvolvimento,conclusao,referencias,theme]);

  const previewRef = useRef(null);

  const handlePrint = () => {
    const node = previewRef.current;
    if(!node) return;
    const html = `
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <title>${titulo}</title>
        <style>
          @page { size: A4; margin: 16mm; }
          body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; color:#111827; }
          .doc { padding: 0; }
          h1{ font-size:24px; margin:0 0 6px 0; }
          h2{ font-size:16px; margin-top:14px; }
          p, li { font-size:13pt; line-height:1.5; }
          .page-footer::after { content: "Página " counter(page); display:block; text-align:right; font-size:11px; color:#6b7280; margin-top:10px; }
          @media print{ body{counter-reset: page;} }
        </style>
      </head>
      <body>
        <div class="doc">${node.innerHTML}</div>
        <div class="page-footer"></div>
      </body>
      </html>
    `;
    const w = window.open("", "_blank", "noopener,noreferrer");
    if(!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  };

  const indiceList = useMemo(()=>indice.split(/\n+/).filter(Boolean),[indice]);

  useEffect(()=>{
    if(theme === "dark") document.documentElement.setAttribute("data-theme","dark");
    else document.documentElement.removeAttribute("data-theme");
  },[theme]);

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={Logo} alt="logo" width="44" height="44" />
          <div>
            <h1 className="text-xl font-bold">Trabalhos — PDF</h1>
            <div className="text-sm text-gray-500">Editor rápido ● Guardar ● Gerar PDF</div>
          </div>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button className="btn-ghost" onClick={()=>{ setTitulo("Perspetiva Sociológica do Conhecimento"); setDesenvolvimento(generateLongFilosofia()); }}>Repor template</button>
          <button className="btn" onClick={handlePrint}>Salvar em PDF</button>
          <select value={theme} onChange={e=>setTheme(e.target.value)} className="ml-2">
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <label className="text-sm text-gray-700">Título</label>
          <input type="text" value={titulo} onChange={e=>setTitulo(e.target.value)} />

          <div className="grid grid-cols-2 gap-2 mt-3">
            <div>
              <label className="text-sm text-gray-700">Autor</label>
              <input type="text" value={autor} onChange={e=>setAutor(e.target.value)} placeholder="Nome do aluno" />
            </div>
            <div>
              <label className="text-sm text-gray-700">Turma</label>
              <input type="text" value={turma} onChange={e=>setTurma(e.target.value)} placeholder="Ex.: 11.º A" />
            </div>
          </div>

          <label className="text-sm text-gray-700 mt-3">Data</label>
          <input type="text" value={dataDoc} onChange={e=>setDataDoc(e.target.value)} />

          <label className="text-sm text-gray-700 mt-3">Índice (uma linha por item)</label>
          <textarea rows="4" value={indice} onChange={e=>setIndice(e.target.value)} />

          <label className="text-sm text-gray-700 mt-3">Introdução</label>
          <textarea rows="4" value={introducao} onChange={e=>setIntroducao(e.target.value)} />

          <label className="text-sm text-gray-700 mt-3">Desenvolvimento</label>
          <textarea rows="10" value={desenvolvimento} onChange={e=>setDesenvolvimento(e.target.value)} />

          <label className="text-sm text-gray-700 mt-3">Conclusão</label>
          <textarea rows="4" value={conclusao} onChange={e=>setConclusao(e.target.value)} />

          <label className="text-sm text-gray-700 mt-3">Referências</label>
          <textarea rows="4" value={referencias} onChange={e=>setReferencias(e.target.value)} />
        </div>

        <div className="card">
          <div ref={previewRef} className="preview" id="print-area">
            <div style={{textAlign:"center", marginBottom:12}}>
              <img src={Logo} alt="logo" style={{width:60,height:60,display:"inline-block"}} />
              <h2 style={{margin:"8px 0", fontSize:22}}>{titulo}</h2>
              <div style={{color:"#6b7280"}}>{autor}{autor && turma ? " • " : ""}{turma}</div>
              <div style={{color:"#6b7280", marginTop:6}}>{dataDoc}</div>
            </div>

            <hr style={{borderColor:"#e5e7eb"}} />

            <h3 style={{marginTop:10}}>Índice</h3>
            <ol>
              {indiceList.map((it,i)=>(<li key={i}>{it}</li>))}
            </ol>

            <h2 style={{marginTop:12}}>Introdução</h2>
            <p style={{whiteSpace:"pre-line"}}>{introducao}</p>

            <h2 style={{marginTop:12}}>Desenvolvimento</h2>
            <div style={{whiteSpace:"pre-line"}}>{desenvolvimento}</div>

            <h2 style={{marginTop:12}}>Conclusão</h2>
            <p style={{whiteSpace:"pre-line"}}>{conclusao}</p>

            <h2 style={{marginTop:12}}>Referências</h2>
            <div style={{whiteSpace:"pre-line"}}>{referencias}</div>

            <div className="page-footer" style={{marginTop:18}}> </div>
          </div>

          <div className="page-footer no-print" style={{marginTop:10}}>
            Sugestão: ao imprimir escolha «Salvar como PDF» e formato A4.
          </div>
        </div>
      </div>
    </div>
  );
}

function generateLongFilosofia(){
  const seed = `**1. Conceitos-chave**\n\n- Conhecimento: crenças justificadas e socialmente situadas.\n- Realidade, Objeto, Conceito: categorias de referência.\n\n**2. Abordagens Filosóficas**\n\n- Empirismo vs Racionalismo. Exemplos e comparação.\n\n**3. Perspectiva Fenomenológica**\n\n- Experiência vivida e intencionalidade.\n\n**4. Exemplos e Implicações**\n\n- Educação, ciência e linguagem.`;
  const filler = Array.from({length:60}).map((_,i)=>`Parágrafo ${i+1}. A sociologia do conhecimento analisa como práticas, instituições e linguagens configuram o que é aceitado como conhecimento. A fenomenologia, por seu turno, descreve a experiência e a constituição de sentido no vivido.`).join("\n\n");
  return `${seed}\n\n**Análise extendida**\n\n${filler}`;
}
