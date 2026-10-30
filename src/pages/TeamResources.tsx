import React from 'react';
import { useProjectData } from '../hooks/useProjectData';
import { Badge } from '../components/common/Badge';
import {
  Users,
  Award,
  GraduationCap,
  ExternalLink,
  Mail,
  Linkedin,
  Github,
  Globe,
  BookOpen,
  FileText,
  ShieldCheck,
} from 'lucide-react';

export const TeamResources: React.FC = () => {
  const { data } = useProjectData();
  const team = data.team;
  const mentor = data.mentor;
  const resources = data.resources;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
            Multidisciplinary Urban Team
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Team Members, Faculty Advisory & Project Resources
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Student contributors, academic supervision, and official documentation links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge source="TEAM VERIFIED" />
        </div>
      </div>

      {/* Faculty Advisor Endorsement Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#102A43] to-[#0D3B43] text-white shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-teal-300 font-bold">
                Academic Supervision & Guidance
              </span>
              <h2 className="text-xl font-bold text-white">
                Faculty Academic Advisor
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>{mentor.spocVerified ? 'Academic Endorsement Verified' : 'In Review'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <span className="text-xs text-slate-300 uppercase tracking-wider font-semibold block mb-1">
              Faculty Advisor
            </span>
            <h3 className="text-lg font-bold text-white mb-1">
              {mentor.facultySpoc}
            </h3>
            <p className="text-xs text-slate-300">
              {mentor.facultyDepartment}
            </p>
          </div>

          {mentor.industryMentor && (
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <span className="text-xs text-slate-300 uppercase tracking-wider font-semibold block mb-1">
                Autodesk Technical Advisor
              </span>
              <h3 className="text-lg font-bold text-white mb-1">
                {mentor.industryMentor}
              </h3>
              <p className="text-xs text-slate-300">
                Autodesk Software & Educational Advisory
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <span>Core Student Engineering Team</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member) => (
            <div
              key={member.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Photo Placeholder or Avatar */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500/20 to-indigo-500/20 border border-teal-500/30 flex items-center justify-center font-bold text-base text-teal-700 dark:text-teal-300 shrink-0">
                    {member.photoPlaceholder || member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                      {member.role}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 mb-6">
                  <p><strong>Department:</strong> {member.department}</p>
                  {member.institution && <p><strong>Institution:</strong> {member.institution}</p>}
                </div>
              </div>

              {/* Social / Contact Links */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80 flex items-center gap-3 text-slate-500">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-teal-600 transition-colors"
                    title={`Email ${member.name}`}
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-teal-600 transition-colors"
                    title="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-teal-600 transition-colors"
                    title="GitHub Profile"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {member.portfolio && (
                  <a
                    href={member.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-teal-600 transition-colors"
                    title="Personal Portfolio"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
                <span className="ml-auto text-[10px] font-mono text-slate-400">
                  PROJECT TEAM
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Documentation & Resources Links */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span>Official Standards & Documentation Resources</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Direct reference portals for Autodesk Forma, Revit interoperability, and sustainable urban planning standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((res, i) => (
            <a
              key={i}
              href={res.url}
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-teal-500 transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1 block">
                  {res.category}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-between">
                  <span>{res.title}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:text-teal-500 transition-opacity" />
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {res.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
