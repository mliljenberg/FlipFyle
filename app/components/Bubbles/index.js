/**
 *
 * Bubbles
 * react/prefer-stateless-function
 */
/* eslint-disable  */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {colors} from '../../design'

const orange = colors.orange;
const grey = colors.grey;
const brown = colors.brown;
const black = colors.black;

const Bubble = styled.div`
display: block;
margin-top: -${props => props.size}px;
width: ${props => props.size}px;
height: ${props => props.size}px;
background: ${props => props.color};
border-radius: 50%;
animation-name: ${props => props.name};
animation-duration:${props => props.duration}s;
animation-timing-function: linear;
animation-iteration-count: infinite;
opacity:0;
animation-delay:  ${props => props.delay}s;

@keyframes ${props => props.name}  {
0% {transform: translate(0px,${props =>
  props.up
    ? props.startY
    : -(props.length * Math.cos(props.angle) - props.startY)}px); opacity:0;}
90% { opacity:0.95;}
100% {transform: translate(${props =>
  props.length * Math.sin(props.angle)}px, -${props =>
  props.up
    ? props.length * Math.cos(props.angle) - props.startY
    : -props.startY}px); opacity:0;}
0% {transform: translate(0px,${props =>
  props.up
    ? props.startY
    : -(props.length * Math.cos(props.angle) - props.startY)}px);  opacity:0.9;}
`;

const insideDuration = 2;
const insideStart = -120;
const insideLength = 300;
const delayPiece = insideDuration / 6;

class Bubbles extends React.Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return (
      <span>
        <Bubble
          name="hi"
          duration={insideDuration}
          up={this.props.up}
          delay={0}
          color={orange}
          size={40}
          startY={insideStart}
          angle={0}
          length={insideLength}
        />
        <Bubble
          duration={insideDuration}
          up={this.props.up}
          name="hi5"
          delay={delayPiece}
          color={grey}
          size={20}
          startY={insideStart}
          angle={0}
          length={insideLength}
        />
        <Bubble
          duration={insideDuration}
          up={this.props.up}
          name="hi4"
          delay={2 * delayPiece}
          color={black}
          size={40}
          startY={insideStart}
          angle={0}
          length={insideLength}
        />
        <Bubble
          duration={insideDuration}
          up={this.props.up}
          name="hi3"
          delay={3 * delayPiece}
          color={brown}
          size={30}
          startY={insideStart}
          angle={0}
          length={insideLength}
        />
        <Bubble
          duration={insideDuration}
          up={this.props.up}
          name="hi2"
          delay={4 * delayPiece}
          color={orange}
          size={20}
          startY={insideStart}
          angle={0}
          length={insideLength}
        />
        <Bubble
          duration={insideDuration}
          up={this.props.up}
          name="hi6"
          delay={5 * delayPiece}
          color={black}
          size={30}
          startY={insideStart}
          angle={0}
          length={insideLength}
        />
      </span>
    );
  }
}

Bubbles.propTypes = {
  up: PropTypes.bool,
};

export default Bubbles;
// <Bubble
//   up
//   duration={2}
//   name={'hig1'}
//   delay={2.5}
//   color={grey}
//   size={20}
//   startY={-300}
//   angle={0}
//   length={200}
// />
// <Bubble
//   up
//   duration={2}
//   name={'hig2'}
//   delay={2.5}
//   color={grey}
//   size={20}
//   startY={-300}
//   angle={Math.PI/9}
//   length={200}
// />
// <Bubble
//   up
//   duration={2}
//   name={'hig3'}
//   delay={2.5}
//   color={grey}
//   size={20}
//   startY={-300}
//   angle={Math.PI/5}
//   length={200}
// />
// <Bubble
//   up
//   duration={2}
//   name={'hig4'}
//   delay={2.5}
//   color={grey}
//   size={20}
//   startY={-300}
//   angle={Math.PI/3}
//   length={200}
// />
// <Bubble
//   up
//   duration={2}
//   name={'hig21'}
//   delay={2.5}
//   color={grey}
//   size={20}
//   startY={-300}
//   angle={-Math.PI/9}
//   length={200}
// />
// <Bubble
//   up
//   duration={2}
//   name={'hig31'}
//   delay={2.5}
//   color={grey}
//   size={20}
//   startY={-300}
//   angle={-Math.PI/5}
//   length={200}
// />
// <Bubble
//   up
//   duration={2}
//   name={'hig41'}
//   delay={2.5}
//   color={grey}
//   size={20}
//   startY={-300}
//   angle={-Math.PI/3}
//   length={200}
// />
//
//
// <Bubble
//   name={'hio1'}
//   up
//   duration={2}
//   delay={2}
//   color={orange}
//   size={40}
//   startY={-300}
//   angle={0}
//   length={200}
// />
// <Bubble
//   name={'hio2'}
//   up
//   duration={2}
//   delay={2}
//   color={orange}
//   size={40}
//   startY={-300}
//   angle={Math.PI/3}
//   length={200}
// />
// <Bubble
//   name={'hio3'}
//   up
//   duration={2}
//   delay={2}
//   color={orange}
//   size={40}
//   startY={-300}
//   angle={Math.PI/9}
//   length={200}
// />
// <Bubble
//   name={'hio4'}
//   up
//   duration={2}
//   delay={2}
//   color={orange}
//   size={40}
//   startY={-300}
//   angle={Math.PI/5}
//   length={200}
// />
// <Bubble
//   name={'hio21'}
//   up
//   duration={2}
//   delay={2}
//   color={orange}
//   size={40}
//   startY={-300}
//   angle={-Math.PI/3}
//   length={200}
// />
// <Bubble
//   name={'hio31'}
//   up
//   duration={2}
//   delay={2}
//   color={orange}
//   size={40}
//   startY={-300}
//   angle={-Math.PI/9}
//   length={200}
// />
// <Bubble
//   name={'hio41'}
//   up
//   duration={2}
//   delay={2}
//   color={orange}
//   size={40}
//   startY={-300}
//   angle={-Math.PI/5}
//   length={200}
// />
//
// <Bubble
//   up
//   duration={2}
//   name={'hib1'}
//   delay={3}
//   color={black}
//   size={40}
//   startY={-300}
//   angle={0}
//   length={200}
// />
// <Bubble
//   up
//   duration={2}
//   name={'hib2'}
//   delay={3}
//   color={black}
//   size={40}
//   startY={-300}
//   angle={Math.PI/9}
//   length={200}
// />
// <Bubble
//   up
//   duration={2}
//   name={'hib3'}
//   delay={3}
//   color={black}
//   size={40}
//   startY={-300}
//   angle={Math.PI/5}
//   length={200}
// />
// <Bubble
//   up
//   duration={2}
//   name={'hib4'}
//   delay={3}
//   color={black}
//   size={40}
//   startY={-300}
//   angle={Math.PI/3}
//   length={200}
// />
// <Bubble
//   up
//   duration={2}
//   name={'hib21'}
//   delay={3}
//   color={black}
//   size={40}
//   startY={-300}
//   angle={-Math.PI/9}
//   length={200}
// />
// <Bubble
//   up
//   duration={2}
//   name={'hib31'}
//   delay={3}
//   color={black}
//   size={40}
//   startY={-300}
//   angle={-Math.PI/5}
//   length={200}
// />
// <Bubble
//   up
//   duration={2}
//   name={'hib41'}
//   delay={3}
//   color={black}
//   size={40}
//   startY={-300}
//   angle={-Math.PI/3}
//   length={200}
// />
