/*
 * Copyright 2010 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

addScriptToInject(function() {

chrome_comp.CompDetect.declareDetector(

'table_cellspacing_border_collapse',

chrome_comp.CompDetect.ScanDomBaseDetector,

null, // constructor

function checkNode(node, context) {
  if (Node.ELEMENT_NODE != node.nodeType)
    return;

  if (context.isDisplayNone())
    return;

  var computedStyle = chrome_comp.getComputedStyle(node);
  var display = computedStyle.display;
  if (display == 'table' || display == 'inline-table') {
    var borderCollapse = computedStyle.borderCollapse;
    switch (borderCollapse) {
      case 'collapse':
        if (node.hasAttribute('cellspacing'))
          this.addProblem('RX1008', [node]);
        break;
      case 'separate':
        var hSpacing = parseInt(computedStyle.WebkitBorderHorizontalSpacing);
        var vSpacing = parseInt(computedStyle.WebkitBorderVerticalSpacing);
        if (node.hasAttribute('cellspacing')) {
          var spacing = parseInt(node.getAttribute('cellspacing'));
          if (!hSpacing || hSpacing != spacing ||
              !vSpacing || vSpacing != spacing)
            this.addProblem('RE1020', [node]);
        } else if (hSpacing || vSpacing)
          this.addProblem('RE1020', [node]);
    }
  }
}
); // declareDetector

});
