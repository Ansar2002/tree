

import React, { useState, useEffect } from 'react';
import TreeItem from '@material-ui/lab/TreeItem';
import { Checkbox } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeView from '@material-ui/lab/TreeView';
import './Treeview.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const initialTreeData = [
  {
    id: 1,
    name: "Parent 1",
    checked: false,
    children: [
      {
        id: 2,
        name: "Child 1",
        checked: false,
        children: [
          {
            id: 3,
            name: "Grandchild 1",
            checked: false,
          },
          {
            id: 4,
            name: "Grandchild 2",
            checked: false,
          },
        ],
      },
      {
        id: 5,
        name: "Child 2",
        checked: false,
        children: [
          {
            id: 6,
            name: "Grandchild 3",
            checked: false,
          },
        ],
      },
    ],
  },
];

const Treeview = () => {
  const [originalTreeData, setOriginalTreeData] = useState([]);
  const [treeData, setTreeData] = useState(initialTreeData);
  const [searchText, setSearchText] = useState("");
  const [highlightedText, setHighlightedText] = useState("");
  const [showChanges, setShowChanges] = useState(false);
  const [checkedIds, setCheckedIds] = useState(new Set());
  

  useEffect(() => {
    setOriginalTreeData(initialTreeData);
  }, []);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setHighlightedText(""); 
    setShowChanges(false); 
  };

  const handleCheckboxChange = (nodeId) => {
    setTreeData((prevTreeData) =>
      prevTreeData.map((node) =>
        node.id === nodeId
          ? { ...node, checked: !node.checked }
          : updateCheckedState(node, nodeId)
      )
    );
    setCheckedIds((prevCheckedIds) => {
      const newCheckedIds = new Set(prevCheckedIds);
      if (prevCheckedIds.has(nodeId)) {
        newCheckedIds.delete(nodeId);
      } else {
        newCheckedIds.add(nodeId);
      }
      return newCheckedIds;
    });
  };

  const updateCheckedState = (parentNode, nodeId) => {
    if (parentNode.children) {
      return {
        ...parentNode,
        children: parentNode.children.map((childNode) =>
          childNode.id === nodeId
            ? { ...childNode, checked: !childNode.checked }
            : updateCheckedState(childNode, nodeId)
        ),
      };
    }
    return parentNode;
  };

  const handleSave = () => {
    setShowChanges(true);
   
  };
  const reset = () => {
    window.location.reload(false);
  }

  const renderTree = (nodes) => {
    const label = (
      <div>
        <Checkbox
  checked={nodes.checked || false}
  onChange={() => handleCheckboxChange(nodes.id)}
  color={checkedIds.has(nodes.id) ? "secondary" : (showChanges ? "green" : "red")} 
/>

        {searchText.trim() !== "" ? (
          nodes.name.split(new RegExp(`(${searchText})`, 'gi')).map((part, index) => (
            part.toLowerCase() === searchText.toLowerCase() ? (
              <span key={index} style={{ backgroundColor: "yellow" }}>{part}</span>
            ) : (
              <span key={index}>{part}</span>
            )
          ))
        ) : (
          nodes.name
        )}
      </div>
    );

    return (
      <TreeItem
        key={nodes.id}
        nodeId={String(nodes.id)}
        label={label}
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => renderTree(node))
          : null}
      </TreeItem>
    );
  };

  return (
    <div className="container">
    <div className="row mt-3">
      <div className="col">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={searchText}
          onChange={handleSearchChange}
        />
      </div>
    </div>
    <div className="row mt-3">
      <div className="col">
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {showChanges ? treeData.map((node) => renderTree(node)) : originalTreeData.map((node) => renderTree(node))}
        </TreeView>
      </div>
    </div>
    <div className="row mt-3">
      <div className="col">
        <button onClick={handleSave} className='btn btn-primary'>Save</button>
        <button onClick={reset} className='btn btn-secondary ml-2'>Reset</button>
      </div>
    </div>
  </div>
  );
};

export default Treeview;

