import React from 'react';
import {
  Routes,
  Route,
  BrowserRouter,
} from 'react-router-dom';
import HomePage from '../Home/Home';
import TeacherDashboard from '../TeacherDashboard/TeacherDashboard';
import PageNotFound from '../PageNotFound/PageNotFound';
import TeacherLessonPlan from '../TeacherLessonPlan/TeacherLessonPlan';
import TeacherSession from '../TeacherSession/TeacherSession';
import StudentDashboard from '../StudentDashboard/StudentDashboard';
import StudentSession from '../StudentSession/StudentSession';
import LoginRegister from '../LoginRegister/LoginRegister';

function Hub() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/s/dashboard" element={<StudentDashboard />} />
        <Route path="/t/dashboard" element={<TeacherDashboard />} />
        <Route path="/t/plan/*" element={<TeacherLessonPlan />} />
        <Route path="/t/session/*" element={<TeacherSession />} />
        <Route path="/s/session/*" element={<StudentSession />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Hub;
