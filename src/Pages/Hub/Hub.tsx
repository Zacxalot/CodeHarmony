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
import PlanShare from '../PlanShare/PlanShare';
import TeacherPublishedPlan from '../TeacherPublishedPlan/TeacherPublishedPlan';
import Profile from '../Profile/Profile';

function Hub() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/s/dashboard" element={<StudentDashboard />} />
        <Route path="/t/dashboard" element={<TeacherDashboard />} />
        <Route path="/t/plan/*" element={<TeacherLessonPlan />} />
        <Route path="/t/session/*" element={<TeacherSession />} />
        <Route path="/t/browse" element={<PlanShare />} />
        <Route path="/t/published/*" element={<TeacherPublishedPlan />} />
        <Route path="/s/session/*" element={<StudentSession />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Hub;
