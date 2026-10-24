import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Lock,
  ArrowRight
} from 'lucide-react';
import { submitFacilityClaim } from '../lib/queueService';
import { useAuth } from '../context/AuthContext';

export default function FacilityClaimModal({
  facility,
  isOpen,
  onClose,
  onClaimSuccess
}) {
  const { currentUser } = useAuth();

  const [claimantName, setClaimantName] = useState(currentUser?.fullName || '');
  const [officialEmail, setOfficialEmail] = useState(currentUser?.email || '');
  const [officialPhone, setOfficialPhone] = useState(currentUser?.phone || '');
  const [designation, setDesignation] = useState('');
  const [governmentIdType, setGovernmentIdType] = useState('Department Service Card');
  const [idProofUrl, setIdProofUrl] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [declarationChecked, setDeclarationChecked] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  if (!isOpen || !facility) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!officialEmail.trim() || !officialPhone.trim() || !designation.trim()) {
      setErrorMessage('Please fill in your official email, phone, and administrative designation.');
      return;
    }

    if (!declarationChecked) {
      setErrorMessage('You must certify that you are an authorized institutional representative.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitFacilityClaim({
        facilityId: facility.id,
        facilityName: facility.name,
        claimantName,
        officialEmail,
        officialPhone,
        designation,
        governmentIdType,
        idProofUrl,
        additionalNotes
      });

      setIsSubmittedSuccess(true);
      if (onClaimSuccess) onClaimSuccess();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit claim. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 to-slate-900 p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-teal-500/20 border border-teal-400/30 text-teal-300">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Institutional Verification
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-white">
            Claim Facility Administration
          </h3>
          <p className="text-xs text-slate-300 mt-1 line-clamp-1">
            {facility.name} • {facility.district}, {facility.state}
          </p>
        </div>

        {/* Content */}
        {isSubmittedSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">
              Claim Submitted for Verification
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              Your administrative request for <strong>{facility.name}</strong> has been securely logged. QueueLess AI super administrators will verify your credentials against public records before activating facility manager privileges.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
              Zero self-escalation guarantee: You will receive an in-app notification once verified.
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate-800 text-sm">
            
            {/* Warning / Security Notice */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
              <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Strict Role Escalation Policy:</strong> Users cannot assign themselves admin roles. Institutional claims require verification of government ID and official department email.
              </span>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={claimantName}
                  onChange={(e) => setClaimantName(e.target.value)}
                  placeholder="Officer / Staff Full Name"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-sm focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  required
                  value={officialEmail}
                  onChange={(e) => setOfficialEmail(e.target.value)}
                  placeholder="officer@tn.gov.in / bank.com"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-sm focus:outline-hidden focus:border-teal-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Contact Phone
                </label>
                <input
                  type="tel"
                  required
                  value={officialPhone}
                  onChange={(e) => setOfficialPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-sm focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Designation
                </label>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Branch Manager, Superintendent, RTO Officer"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-sm focus:outline-hidden focus:border-teal-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Government ID / Proof Type
                </label>
                <select
                  value={governmentIdType}
                  onChange={(e) => setGovernmentIdType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-sm focus:outline-hidden focus:border-teal-600"
                >
                  <option value="Department Service Card">Department Employee Card</option>
                  <option value="Government Service Identity">Government Service Identity</option>
                  <option value="Institutional Authorization Letter">Institutional Authorization Letter</option>
                  <option value="Official Gazetted Order">Official Gazetted Order</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ID Reference / Verification Document URL
                </label>
                <input
                  type="text"
                  value={idProofUrl}
                  onChange={(e) => setIdProofUrl(e.target.value)}
                  placeholder="Document number or portal verification link"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-sm focus:outline-hidden focus:border-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Additional Notes & Counter Dispatch Setup Details
              </label>
              <textarea
                rows={2}
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Mention counter requirements or department details..."
                className="w-full px-3.5 py-2 rounded-2xl border border-slate-300 text-sm focus:outline-hidden focus:border-teal-600"
              />
            </div>

            {/* Declaration Checkbox */}
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <input
                type="checkbox"
                id="claim-declaration"
                checked={declarationChecked}
                onChange={(e) => setDeclarationChecked(e.target.checked)}
                className="mt-1 w-4 h-4 text-teal-600 rounded-sm border-slate-300 cursor-pointer"
              />
              <label htmlFor="claim-declaration" className="text-xs text-slate-700 cursor-pointer">
                I hereby declare that I am an authorized administrative staff member of this institution. I understand that fraudulent claims are subject to institutional reporting and immediate rejection.
              </label>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 transition-all cursor-pointer shadow-md"
              >
                <span>{isSubmitting ? 'Submitting Claim...' : 'Submit Claim'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
