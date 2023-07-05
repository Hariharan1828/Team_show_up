import React, { useEffect, useRef} from 'react';
import {
  select,
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter,
  forceCollide,
  drag,
  zoom,
  zoomIdentity,
  pointer,
  


} from 'd3';



import {
  nodes,
  links,
  MANY_BODY_STRENGTH,
  defaultNodeSize,
  textoffset,
  subtextOffset,
  imageOffset,
} from './data';

import './style.css';

function Graph({ svgRef }) {
  const containerRef = useRef(null);
  const zoomTransformRef = useRef(null);

  
  useEffect(() => {
    const svg = select(svgRef.current);

    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const centerX = width / 2;
    const centerY = height / 2;
    

    const initialX = window.innerWidth / 2;
    const initialY = window.innerHeight / 2;



    //zoom
    const zoomBehavior = zoom().on('zoom', zoomed);

    svg.call(zoomBehavior);
    
    

    
    
  

    const simulation = forceSimulation(nodes)
      .force('charge', forceManyBody().strength(MANY_BODY_STRENGTH))
      .force('x', forceCenter(centerX).strength(0.5))
      .force('y', forceCenter(centerY).strength(0.5))
      .force('link', forceLink(links).strength(0.5).distance((link) => link.distance+100))
      .force("center", forceCenter(initialX , initialY+300))
      .alphaTarget(-0.125)
      .force(
        'collision',
        forceCollide().radius((node) => node.size*1.5) // Adjust the collision radius based on the node size
      )
      .alphaDecay(0.5);

    const dragInteraction = drag().on('drag', (event, node) => {
      node.fx = event.x;
      node.fy = event.y;
      simulation.alpha(0.5).restart();
    });

    const lines = svg
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', 'gray')
      .on('click', handleClick)
      .attr('stroke-width', (link) => link.thickness || 1);

    const labels = svg
      .selectAll('.link-label')
      .data(links)
      .enter()
      .append('text')
      .attr('class', 'link-label')
      .attr('text-anchor', 'middle')
      .style('font-weight', 'bold')
      .attr('dy', -5)
      .attr('dx', -5)
      .on('click', handleClick)
      .text((link) => link.relationship);

    const circles = svg
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('fill', (node) => node.color || 'gray')
      .attr('r', defaultNodeSize)
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .on('click', handleClick)
      .call(dragInteraction);

    const images = svg
      .selectAll('image')
      .data(nodes)
      .enter()
      .append('image')
      .attr('xlink:href', (node) => node.image)
      .attr('x', (node) => node.x - (node.size * imageOffset) / 2)
      .attr('y', (node) => node.y - (node.size * imageOffset) / 2)
      .attr('width', (node) => node.size * imageOffset)
      .attr('height', (node) => node.size * imageOffset)
      .classed('circle-image', true)
      .on('click', handleClick)
      .call(dragInteraction);

    const text = svg
      .selectAll('.node-label')
      .data(nodes)
      .enter()
      .append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .style('pointer-events', 'none')
      .style('font-weight', 'bold')
      .style('font-family', 'Arial')
      .style('font-size', (node) => Math.min(node.size / 3, 18))
      .text((node) => node.id)
      .attr('x', (node) => node.x)
      .on('click', handleClick)
      .attr('y', (node) => node.y + node.size / 2 + ((node.textof)?node.textof:textoffset));

    const subtext = svg
      .selectAll('.node-sublabel')
      .data(nodes)
      .enter()
      .append('text')
      .text((node) => node.designation)
      .attr('class', 'node-sublabel')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .style('pointer-events', 'none')
      .style('font-size', '12px')
      .style('font-family', 'Arial')
      .attr('x', (node) => node.x)
      .attr('y', (node) => node.y + node.size / 2 + subtextOffset)
      .on('click', handleClick)
      .style('font-size', (node) => Math.min(node.size / 3, 1000));


      function filterNodesBySetNumber(setNumber) {
        circles.style('opacity', (node) => (node.set <= setNumber ? 1 : 0));
        text.style('opacity', (node) => (node.set <= setNumber ? 1 : 0));
        subtext.style('opacity', (node) => (node.set <= setNumber ? 1 : 0));
        lines.style('opacity', (link) => (link.source.set <= setNumber && link.target.set <= setNumber ? 1 : 0));
        labels.style('opacity', (link) => (link.source.set <= setNumber && link.target.set <= setNumber ? 1 : 0));
        images.style('opacity', (node) => (node.set <= setNumber ? 1 : 0));
      }

      function handleClick() {
        // Get the set number for filtering
        const setNumber = select(this).datum().set;
  
        // Filter nodes and update visibility of elements
        filterNodesBySetNumber(setNumber);
      }
  

    //to position the svg canvas back to the position when mouseout
      
    function handleMouseout(duration) {
      svg.transition().duration(duration).call(zoomBehavior.transform, zoomIdentity);
    }
    
    svg.on('mouseout', () => {
      handleMouseout(500); // Set the duration to 500 milliseconds
    });
  //for zoom when pressed z key
    function zoomed(event) {
      zoomTransformRef.current = event.transform;
      svg.attr('transform', event.transform);
    }

    function handleKeyDown(event) {
      if (event.key === 'z') {
        const svgNode = svgRef.current;
        const cursorPoint = pointer(event, svgNode);

        const currentZoomTransform = zoomTransformRef.current;
        const newZoomTransform = currentZoomTransform.translate(cursorPoint[0], cursorPoint[1]).scale(2);

        select(svgNode).transition().duration(750).call(zoomBehavior.transform, newZoomTransform);
      }
    }

    svg.on('mouseout', () => {
      svg.transition().duration(500).call(zoomBehavior.transform, zoomIdentity);
    });

    window.addEventListener('keydown', handleKeyDown);

//simulation tick 

    simulation.on('tick', () => {
      circles
      .attr('cx', (d) => (d.px? d.px:d.x))
      .attr('cy', (d) =>  (d.py? d.py:d.y))
      .on('click', handleClick);

      text
        .attr('x', (node) => node.px|| node.x)
        .attr('y', (node) => (node.py + node.size / 2 + ((node.textof)?node.textof:textoffset)) || node.y + node.size / 2 + textoffset)
        .on('click', handleClick);

      subtext
        .attr('x', (node) => node.x)
        .attr('y', (node) => node.y + node.size / 2 + subtextOffset)
        .on('click', handleClick);

      lines
        .attr('x1', (link) => link.source.x)
        .attr('y1', (link) => link.source.y)
        .attr('x2', (link) => link.target.x)
        .attr('y2', (link) => link.target.y)
        .attr('stroke-width', (link) => link.thickness || 1)
        .on('click', handleClick);

      labels
        .attr('x', (link) => (link.source.x + link.target.x) / 2)
        .attr('y', (link) => (link.source.y + link.target.y) / 2)
        .on('click', handleClick);

      images
        .attr('x', (node) => node.x - (node.size * imageOffset) / 2)
        .attr('y', (node) => node.y - (node.size * imageOffset) / 2)
        .attr('width', (node) => node.size * imageOffset)
        .attr('height', (node) => node.size * imageOffset)
        .on('click', handleClick);
    });

    return () => {
      // Clean up event listener
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [svgRef]);



  return (
    <div>
      <svg ref={containerRef} id="container" width="1000" height="1000" />
    </div>
  );
}

export default Graph;
