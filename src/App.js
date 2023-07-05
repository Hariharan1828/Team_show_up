import React, { useEffect, useRef } from 'react';
import Graph from './components/Graph';
// import Header from './components/header';
import './components/style.css'

function App() {
  const svgRef = useRef(null);

  useEffect(() => {
    // Set SVG container dimensions based on window size
    const svgContainer = svgRef.current;
    svgContainer.setAttribute('width', window.innerWidth);
    svgContainer.setAttribute('height', window.innerHeight+1000);
  }, []);

  return (
    <div>
      <ul class="legend">
   
   
    
    <li><span class="Intern"></span> Intern</li>
    <li><span class="Both"></span> Both</li>
    <li><span class="Engage-RCM"></span> Engage-RCM</li>
    <li><span class="iCMS-ACO-Registry"></span> iCMS-ACO-Registry</li>
      </ul>
      <img src="https://jbz2b4.p3cdn1.secureserver.net/wp-content/uploads/2019/08/logo.png" alt="Logo" style={{marginRight: '20px' }} />
      <svg ref={svgRef}></svg> {/* Use the ref to reference the <svg> element */}
      <Graph svgRef={svgRef} /> {/* Pass the svgRef as a prop */}
  </div>
  );
}

export default App;