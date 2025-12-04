'use client';

import { useState, useEffect } from 'react';
import { Upload, X, FileText, ArrowLeft } from 'lucide-react';
import { School } from '@/types';
import { locationData } from '@/components/onboard/locationData';

interface AddSchoolFormProps {
  school?: School | null;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}

export default function AddSchoolForm({ school, onSubmit, onCancel }: AddSchoolFormProps) {
  const currentYear = new Date().getFullYear();
  
  const [formData, setFormData] = useState({
    // Part 1: School Information
    schoolName: '',
    schoolEmail: '',
    schoolPhone: '',
    type: 'Public',
    level: 'Primary',
    numberOfStudents: 0,
    numberOfTeachers: 0,
    subscription: 'Basic',
    subscriptionYear: currentYear.toString(),
    province: '',
    district: '',
    sector: '',
    cell: '',
    village: '',
    registrationDate: '',
    // Part 2: Headmaster Information
    headmasterName: '',
    headmasterEmail: '',
    headmasterPhone: '',
    // Part 3: Documents
    registrationCertificate: null as File | null,
    paymentProof: null as File | null,
    invoice: null as File | null,
    otherDocuments: null as File | null,
    rejectMessage: '',
  });

  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [availableSectors, setAvailableSectors] = useState<string[]>([]);
  const [availableCells, setAvailableCells] = useState<string[]>([]);
  const [availableVillages, setAvailableVillages] = useState<string[]>([]);

  const [sectorSearch, setSectorSearch] = useState('');
  const [cellSearch, setCellSearch] = useState('');
  const [villageSearch, setVillageSearch] = useState('');

  useEffect(() => {
    if (school) {
      setFormData({
        schoolName: school.school_name || '',
        schoolEmail: school.school_email || '',
        schoolPhone: school.school_phone || '',
        type: school.school_type || 'Public',
        level: school.level || 'Primary',
        numberOfStudents: school.number_of_students || 0,
        numberOfTeachers: school.number_of_teachers || 0,
        subscription: school.subscription || 'Basic',
        subscriptionYear: school.subscription_year || currentYear.toString(),
        province: school.province || '',
        district: school.district || '',
        sector: school.sector || '',
        cell: school.cell || '',
        village: school.village || '',
        registrationDate: school.registration_date || '',
        headmasterName: school.headmaster_name || '',
        headmasterEmail: school.headmaster_email || '',
        headmasterPhone: school.headmaster_phone || '',
        registrationCertificate: null,
        paymentProof: null,
        invoice: null,
        otherDocuments: null,
        rejectMessage: school.reject_message || '',
      });
    }
  }, [school, currentYear]);

  // Update districts when province changes
  useEffect(() => {
    if (formData.province && locationData[formData.province]) {
      const districts = Object.keys(locationData[formData.province]);
      setAvailableDistricts(districts);
      setFormData(prev => ({ ...prev, district: '', sector: '', cell: '', village: '' }));
      setAvailableSectors([]);
      setAvailableCells([]);
      setAvailableVillages([]);
    }
  }, [formData.province]);

  // Update sectors when district changes
  useEffect(() => {
    if (formData.province && formData.district && locationData[formData.province]?.[formData.district]) {
      const sectors = Object.keys(locationData[formData.province][formData.district]);
      setAvailableSectors(sectors);
      setFormData(prev => ({ ...prev, sector: '', cell: '', village: '' }));
      setAvailableCells([]);
      setAvailableVillages([]);
    }
  }, [formData.district, formData.province]);

  // Update cells when sector changes
  useEffect(() => {
    if (formData.province && formData.district && formData.sector && 
        locationData[formData.province]?.[formData.district]?.[formData.sector]) {
      const cells = Object.keys(locationData[formData.province][formData.district][formData.sector]);
      setAvailableCells(cells);
      setFormData(prev => ({ ...prev, cell: '', village: '' }));
      setAvailableVillages([]);
    }
  }, [formData.sector, formData.province, formData.district]);

  // Update villages when cell changes
  useEffect(() => {
    if (formData.province && formData.district && formData.sector && formData.cell &&
        locationData[formData.province]?.[formData.district]?.[formData.sector]?.[formData.cell]) {
      const villages = locationData[formData.province][formData.district][formData.sector][formData.cell];
      setAvailableVillages(villages);
      setFormData(prev => ({ ...prev, village: '' }));
    }
  }, [formData.cell, formData.province, formData.district, formData.sector]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fd = new FormData();

    // Append text fields
    fd.append("school_name", formData.schoolName);
    fd.append("school_email", formData.schoolEmail);
    fd.append("school_phone", formData.schoolPhone);
    fd.append("school_type", formData.type);
    fd.append("level", formData.level);
    fd.append("number_of_students", String(formData.numberOfStudents));
    fd.append("number_of_teachers", String(formData.numberOfTeachers));
    fd.append("subscription", formData.subscription);
    fd.append("subscription_year", formData.subscriptionYear);
    fd.append("province", formData.province);
    fd.append("district", formData.district);
    fd.append("sector", formData.sector);
    fd.append("cell", formData.cell);
    fd.append("village", formData.village);
    fd.append("registration_date", formData.registrationDate);
    
    fd.append("headmaster_name", formData.headmasterName);
    fd.append("headmaster_email", formData.headmasterEmail);
    fd.append("headmaster_phone", formData.headmasterPhone);
    
    if (formData.rejectMessage) {
      fd.append("reject_message", formData.rejectMessage);
    }

    // Append files
    if (formData.registrationCertificate) {
      fd.append("registration_certificate", formData.registrationCertificate);
    }

    if (formData.paymentProof) {
      fd.append("payment_proof", formData.paymentProof);
    }

    if (formData.invoice) {
      fd.append("invoice", formData.invoice);
    }

    if (formData.otherDocuments) {
      fd.append("other_documents", formData.otherDocuments);
    }

    onSubmit(fd);
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData({ ...formData, [field]: file });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  const filteredSectors = availableSectors.filter(sector =>
    sector.toLowerCase().includes(sectorSearch.toLowerCase())
  );

  const filteredCells = availableCells.filter(cell =>
    cell.toLowerCase().includes(cellSearch.toLowerCase())
  );

  const filteredVillages = availableVillages.filter(village =>
    village.toLowerCase().includes(villageSearch.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button aria-label='arrow'            
           onClick={onCancel}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-gray-900">{school ? 'Edit School' : 'Add New School'}</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-8">
          {/* Part 1: School Information */}
          <div>
            <h3 className="text-gray-900 mb-4 pb-2 border-b-2 border-blue-500">Part 1: School Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">School Name *</label>
                <input
                  type="text"
                  name='school_name'
                  value={formData.schoolName}
                  onChange={(e) => handleInputChange('schoolName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter school name"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name='school_email'
                  value={formData.schoolEmail}
                  onChange={(e) => handleInputChange('schoolEmail', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="school@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name='school_phone'
                  value={formData.schoolPhone}
                  onChange={(e) => handleInputChange('schoolPhone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="+250 XXX XXX XXX"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">School Type *</label>
                <select aria-label='select type'
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                  <option value="Government-Aided">Government-Aided</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Level *</label>
                <select aria-label='select level'
                  value={formData.level}
                  onChange={(e) => handleInputChange('level', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="Nursery">Nursery</option>
                  <option value="Primary">Primary</option>
                  <option value="Secondary">Secondary</option>
                  <option value="TVET">TVET</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Number of Students *</label>
                <input
                  type="number"
                  value={formData.numberOfStudents}
                  onChange={(e) => handleInputChange('numberOfStudents', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Number of Teachers *</label>
                <input
                  type="number"
                  value={formData.numberOfTeachers}
                  onChange={(e) => handleInputChange('numberOfTeachers', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Subscription *</label>
                <select aria-label='select subscription'
                  value={formData.subscription}
                  onChange={(e) => handleInputChange('subscription', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Subscription Year *</label>
                <input
                  type="text"
                  value={formData.subscriptionYear}
                  onChange={(e) => handleInputChange('subscriptionYear', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="2025"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Registration Date *</label>
                <input
                  type="date"
                  value={formData.registrationDate}
                  onChange={(e) => handleInputChange('registrationDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Province *</label>
                <select aria-label='select province'
                  value={formData.province}
                  onChange={(e) => handleInputChange('province', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="">Select Province</option>
                  <option value="Kigali City">Kigali City</option>
                  <option value="Eastern Province">Eastern Province</option>
                  <option value="Western Province">Western Province</option>
                  <option value="Southern Province">Southern Province</option>
                  <option value="Northern Province">Northern Province</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">District *</label>
                <select aria-label='select district'
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={!formData.province}
                  required
                >
                  <option value="">Select District</option>
                  {availableDistricts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Sector *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.sector || sectorSearch}
                    onChange={(e) => {
                      setSectorSearch(e.target.value);
                      if (!e.target.value) {
                        handleInputChange('sector', '');
                      }
                    }}
                    placeholder={formData.sector || "Search sector..."}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={!formData.district}
                    required
                  />
                  {sectorSearch && !formData.sector && formData.district && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filteredSectors.length > 0 ? (
                        filteredSectors.map(sector => (
                          <button
                            key={sector}
                            type="button"
                            onClick={() => {
                              handleInputChange('sector', sector);
                              setSectorSearch('');
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors"
                          >
                            {sector}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500">No sectors found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Cell *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.cell || cellSearch}
                    onChange={(e) => {
                      setCellSearch(e.target.value);
                      if (!e.target.value) {
                        handleInputChange('cell', '');
                      }
                    }}
                    placeholder={formData.cell || "Search cell..."}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={!formData.sector}
                    required
                  />
                  {cellSearch && !formData.cell && formData.sector && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filteredCells.length > 0 ? (
                        filteredCells.map(cell => (
                          <button
                            key={cell}
                            type="button"
                            onClick={() => {
                              handleInputChange('cell', cell);
                              setCellSearch('');
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors"
                          >
                            {cell}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500">No cells found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Village *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.village || villageSearch}
                    onChange={(e) => {
                      setVillageSearch(e.target.value);
                      if (!e.target.value) {
                        handleInputChange('village', '');
                      }
                    }}
                    placeholder={formData.village || "Search village..."}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={!formData.cell}
                    required
                  />
                  {villageSearch && !formData.village && formData.cell && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filteredVillages.length > 0 ? (
                        filteredVillages.map(village => (
                          <button
                            key={village}
                            type="button"
                            onClick={() => {
                              handleInputChange('village', village);
                              setVillageSearch('');
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors"
                          >
                            {village}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500">No villages found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Part 2: Headmaster Information */}
          <div>
            <h3 className="text-gray-900 mb-4 pb-2 border-b-2 border-green-500">Part 2: Headmaster Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Full Name *</label>
                <input
                  name='headmaster_name'
                  type="text"
                  value={formData.headmasterName}
                  onChange={(e) => handleInputChange('headmasterName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name='headmaster_email'
                  value={formData.headmasterEmail}
                  onChange={(e) => handleInputChange('headmasterEmail', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="headmaster@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name='headmaster_phone'
                  value={formData.headmasterPhone}
                  onChange={(e) => handleInputChange('headmasterPhone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="+250 XXX XXX XXX"
                  required
                />
              </div>
            </div>
          </div>

          {/* Part 3: Documents */}
          <div>
            <h3 className="text-gray-900 mb-4 pb-2 border-b-2 border-purple-500">Part 3: Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUpload
                label="School Registration Certificate *"
                file={formData.registrationCertificate}
                onChange={(file) => handleFileChange('registrationCertificate', file)}
                required
              />
              <FileUpload
                label="Payment Proof *"
                file={formData.paymentProof}
                onChange={(file) => handleFileChange('paymentProof', file)}
                required
              />
              <FileUpload
                label="Invoice"
                file={formData.invoice}
                onChange={(file) => handleFileChange('invoice', file)}
              />
              <FileUpload
                label="Other Documents"
                file={formData.otherDocuments}
                onChange={(file) => handleFileChange('otherDocuments', file)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              {school ? 'Update School' : 'Add School'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

interface FileUploadProps {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  required?: boolean;
}

function FileUpload({ label, file, onChange, required }: FileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    onChange(selectedFile);
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <div>
      <label className="block text-gray-700 mb-2">{label}</label>
      {file ? (
        <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-900">{file.name}</p>
              <p className="text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
          <button aria-label='remove'
            type="button"
            onClick={handleRemove}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-gray-600 mb-1">Click to upload PDF</p>
          <p className="text-gray-400">or drag and drop</p>
          <input
            type="file"
            name='file'
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            required={required && !file}
          />
        </label>
      )}
    </div>
  );
}