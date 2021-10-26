import React from 'react';
import '../App.css';
import axios from 'axios';
import StringFile from './String';
import { Modal, Alert } from 'react-bootstrap';

class Crud extends React.Component {

  state = {
    task: '',
    project: '',
    module: '',
    worktype: '',
    taskNew: '',
    projectNew: '',
    moduleNew: '',
    worktypeNew: '',
    isOpen: false,
    taskid: parseInt(''),
    showAlert: false,
    alertMsg: '',
    alertType: 'success',
    taskList: []
  };

  componentDidMount(){
    this.getTaskList();
  }

  getTaskList = () => {
    axios.get('http://localhost:3001/api/get')
    .then((response) => response.data)
    .then(response => this.setState({
      taskList: response
    }));
  }

  submitTask = () => {
    axios.post('http://localhost:3001/api/insert', {
      project: this.state.project,
      module: this.state.module,
      task: this.state.task,
      worktype: this.state.worktype
    }).then((result) => {
      console.log(result);
    });

    this.getTaskList();

    this.setState({
      project: '',
      module: '',
      task: '',
      worktype: '',
      showAlert: true,
      alertMsg: 'New Task Added Successfully!',
      alertType: 'success'
    });
  };

  deleteTask = (taskId) => {
    axios.delete(`http://localhost:3001/api/delete/${taskId}`);

    this.getTaskList();

    this.setState({
      showAlert: true,
      alertMsg: 'Task Deleted Successfully!',
      alertType: 'danger'
    });
  };

  openModal = (taskId) => {
    axios.get(`http://localhost:3001/api/singlerow/${taskId}`)
    .then((response) => response.data)
    .then(response => this.setState({
      isOpen: true,
      taskid: taskId,
      projectNew: response[0].Project,
      moduleNew: response[0].Module,
      taskNew: response[0].Task,
      worktypeNew: response[0].Worktype
    }));
  }

  closeModal = () => {
    this.setState({
      isOpen: false
    });
  }

  updateTask = () => {
    axios.put('http://localhost:3001/api/update/', {
      taskid: this.state.taskid,
      project: this.state.projectNew,
      module: this.state.moduleNew,
      task: this.state.taskNew,
      worktype: this.state.worktypeNew
    }).then((result) => {
      console.log(result);
    });

    this.closeModal();
    this.getTaskList();

    this.setState({
      projectNew: '',
      moduleNew: '',
      taskNew: '',
      worktypeNew: '',
      showAlert: true,
      alertMsg: 'Task Updated Successfully!',
      alertType: 'info'
    });
  };

  render () {
    return (
    <div className="App">
      {
        this.state.showAlert === true ? (
        <Alert variant={this.state.alertType} onClose={() => {
          this.getTaskList();
          this.setState({
            showAlert: false
          })
        }}
        dismissible
        >
          <Alert.Heading>{this.state.alertMsg}</Alert.Heading>
        </Alert> 
        ) : null
      }
        <br/>
        {/*<h2>Project Account</h2>*/}
        <StringFile/>
        <br/>
        <div className="insert">
          <div className="ui form">
            <div className="inline fields">
              <div className="field">
                <input type="text" name="project" placeholder="Add a project" value={this.state.project} onChange={(e) => this.setState({project: e.target.value})}/>
              </div>
              <div className="field">
                <input type="text" name="module" placeholder="Add a module" value={this.state.module} onChange={(e) => this.setState({module: e.target.value})}/>
              </div>
              <div className="field">
                <input type="text" name="task" placeholder="Add new task" value={this.state.task} onChange={(e) => this.setState({task: e.target.value})}/>
              </div>
              <div className="field">
                <input type="text" name="worktype" placeholder="Add worktype" value={this.state.worktype} onChange={(e) => this.setState({worktype: e.target.value})}/>
              </div>
              
              <div class="field">
                <button type="submit" className="ui primary button basic" onClick= {() => this.submitTask()}>Add</button>
              </div>
            </div>
          </div>
        </div>
        <br/><hr/><br/>
        
        {/*<div class="ui form">
          <div class="inline fields">
            <div className="field">
              <label>Search:</label>
              <input type="text" placeholder="Search..." onChange={(e) => this.setState({search: e.target.value})}></input>
            </div>
          </div>
        </div>*/}

        <table className="ui celled table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Module</th>
              <th>Task</th>
              <th>Worktype</th>
              <th colspan="2">Actions</th>
            </tr>
          </thead>
          <tbody>
          {this.state.taskList.map((val) => {
          return (
            <tr>
              <td data-label="project">{val.Project}</td>
              <td data-label="module">{val.Module}</td>
              <td data-label="task">{val.Task}</td>
              <td data-label="worktype">{val.Worktype}</td>
              <td>
                <button className="ui basic green button" onClick={() => this.openModal(val.id)}>Edit</button>
              </td>
              <td>
                <button className="ui basic red button" onClick={() => this.deleteTask(val.id)}>Delete</button>
              </td>
            </tr>
            );
          })}
          </tbody>
        </table>
        
        {/* Update Modal code */}
        <Modal show={this.state.isOpen}>
          <Modal.Header>
            <Modal.Title>Update Task</Modal.Title>
            <button type="button" className="close" onClick={() => this.closeModal()}>
              <span aria-hidden="true">&times;</span>
            </button>
          </Modal.Header>
          <Modal.Body>
            <div className="ui form">
              <p><span className="modal-lable">Project:</span>
              <input value={this.state.projectNew} onChange={(e) => this.setState({projectNew: e.target.value})}/></p>
              <p><span className="modal-lable">Module:</span>
              <input value={this.state.moduleNew} onChange={(e) => this.setState({moduleNew: e.target.value})}/></p>
              <p><span className="modal-lable">Task:</span>
              <input value={this.state.taskNew} onChange={(e) => this.setState({taskNew: e.target.value})}/></p>
              <p><span className="modal-lable">Worktype:</span>
              <input value={this.state.worktypeNew} onChange={(e) => this.setState({worktypeNew: e.target.value})}/></p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-secondary" onClick={() => this.closeModal()}>Close</button>
            <button type="button" className="btn btn-primary" onClick= {() => this.updateTask()}>Save</button>
          </Modal.Footer>
        </Modal>
    </div>
  );
  }
}

export default Crud;
