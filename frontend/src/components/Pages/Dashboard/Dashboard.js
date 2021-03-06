import React, { Component } from 'react';
import AtendeesPanel from "./Panels/AtendeesPanel";
import CompliancePanel from "./Panels/CompliancePanel";
import WeekPanel from "./Panels/WeekPanel";

class Dashboard extends Component {

    render() {
        return (
            <div className="dashboard">
                {Object.entries(this.props.Student).length > 0 && <div className="body">
                    <div className="info-panel">
                        <div className="row">
                            <div className="col-lg-6 label-estudiante">
                                <h1><span className="label-const"> Estudiante: </span><span>{this.props.Student.nombre}</span></h1>
                            </div>
                            <div className="col-lg-3 label-ingresos">
                                <h1><span>{this.props.Student.login_number}</span><span className="label-const"> Ingresos a SAVIO</span></h1>
                            </div>
                        </div>
                    </div>
                    <AtendeesPanel graphs={this.props.Student.graphs} />
                    <CompliancePanel graphs={this.props.Student.graphs} />
                    <WeekPanel graphs={this.props.Student.graphs} />
                </div>}
            </div>
        );
    }
}

export default Dashboard;
