// Copyright 2021, University of Colorado Boulder

/**
 * A maximum of 1 horizontal ruler and 1 vertical ruler can be dragged out from this toolbox panel.
 * The toolbox panel shows a miniature version of these rulers.
 * Appears in the top right corner of the simulation.
 *
 * @author Sarah Chang (Swarthmore College)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Panel from '../../../../sun/js/Panel.js';
import geometricOptics from '../../geometricOptics.js';

class ToolboxPanel extends Panel {
  /**
   * @param {GeometricOpticRulersLayer} rulersLayer
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( rulersLayer, tandem, options ) {


    options = merge( {
      align: 'center',
      cornerRadius: 5,
      xMargin: 10,
      yMargin: 7,
      fill: 'white',
      stroke: 'grey'
    }, options );

    // create two icons for rulers: A vertical and a Horizontal ruler
    const horizontalRulerIconNode = ToolboxPanel.getRulerIcon( false );
    const verticalRulerIconNode = ToolboxPanel.getRulerIcon( true );

    const toolbox = new HBox( {
      spacing: 30,
      children: [ verticalRulerIconNode, horizontalRulerIconNode ],
      excludeInvisibleChildrenFromBounds: false
    } );

    super( toolbox, options );


    const createForwardEvent = ( iconNode, rulerNode ) => {

      const visibleIconProperty = new BooleanProperty( true );

      visibleIconProperty.link( visible => {
        iconNode.visible = visible;
        rulerNode.visible = !visible;
      } );

      iconNode.addInputListener( DragListener.createForwardingListener( event => {
        if ( visibleIconProperty.value ) {
          visibleIconProperty.value = false;
          rulerNode.center = this.globalToParentPoint( event.pointer.point );
          rulerNode.startDrag( event );
        }
      } ) );
    };

    createForwardEvent( horizontalRulerIconNode, rulersLayer.horizontalRulerNode );
    createForwardEvent( verticalRulerIconNode, rulersLayer.verticalRulerNode );
  }

  /**
   * Returns a small ruler icon
   * @private
   * @param {boolean} isVertical
   * @returns {RulerNode} rulerIconNode
   */
  static getRulerIcon( isVertical ) {

    const rulerWidth = 400;
    const rulerHeight = 0.18 * rulerWidth;
    const majorTickLabels = [ '' ];
    for ( let i = 1; i < 5; i++ ) { // create 5 empty strings for labels
      majorTickLabels.push( '' );
    }
    const majorTickWidth = rulerWidth / ( majorTickLabels.length - 1 );
    const units = ''; // empty string for units

    const rulerIconNode = new RulerNode( rulerWidth, rulerHeight, majorTickWidth, majorTickLabels, units, {
        tickMarksOnBottom: false,
        minorTicksPerMajorTick: 1,
        majorTickHeight: ( 0.6 * rulerHeight ) / 2,
        minorTickHeight: ( 0.4 * rulerHeight ) / 2,
        majorTickLineWidth: 2
      }
    );
    rulerIconNode.scale( 0.12 );

    // rotate to create vertical ruler
    if ( isVertical ) {
      rulerIconNode.rotate( -Math.PI / 2 );
    }

    return rulerIconNode;
  }
}

geometricOptics.register( 'ToolboxPanel', ToolboxPanel );
export default ToolboxPanel;
