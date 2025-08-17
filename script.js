
        let educationIndex = 1;
        let experienceIndex = 1;
        let skills = [];

        // Progress bar calculation
        function updateProgressBar() {
            const form = document.getElementById('resumeForm');
            const inputs = form.querySelectorAll('input[required], textarea');
            let filled = 0;
            
            inputs.forEach(input => {
                if (input.value.trim() !== '') filled++;
            });
            
            const progress = (filled / inputs.length) * 100;
            document.getElementById('progressBar').style.width = progress + '%';
        }

        // Real-time update listeners
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('resumeForm');
            const inputs = form.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                input.addEventListener('input', function() {
                    updateResume();
                    updateProgressBar();
                });
            });

            // Skills input handler
            document.getElementById('skillInput').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const skill = this.value.trim();
                    if (skill && !skills.includes(skill)) {
                        skills.push(skill);
                        renderSkills();
                        updateSkillsPreview();
                        this.value = '';
                        updateResume();
                    }
                }
            });

            updateProgressBar();
        });

        function renderSkills() {
            const container = document.getElementById('skillsContainer');
            container.innerHTML = skills.map((skill, index) => 
                `<span class="skill-tag" onclick="removeSkill(${index})">${skill} ×</span>`
            ).join('');
            updateSkillsPreview();
        }

        function updateSkillsPreview() {
            const previewList = document.getElementById('previewSkillsList');
            if (skills.length === 0) {
                previewList.textContent = 'No skills added yet. Add skills to see them here.';
                previewList.style.color = '#666';
            } else {
                previewList.innerHTML = skills.map(skill => 
                    `<span style="display: inline-block; background: #e8ebff; color: #667eea; padding: 0.2rem 0.5rem; margin: 0.2rem; border-radius: 10px; font-size: 0.9rem;">${skill}</span>`
                ).join('');
                previewList.style.color = '#333';
            }
        }

        function addSkillFromSelect() {
            const select = document.getElementById('skillSelect');
            const skill = select.value;
            
            if (skill && !skills.includes(skill)) {
                skills.push(skill);
                renderSkills();
                updateSkillsPreview();
                select.value = ''; // Reset selection
                updateResume();
            } else if (skills.includes(skill)) {
                // Brief visual feedback for duplicate
                const container = document.getElementById('skillsContainer');
                container.style.transform = 'shake';
                setTimeout(() => {
                    container.style.transform = '';
                }, 300);
            }
        }

        function removeSkill(index) {
            skills.splice(index, 1);
            renderSkills();
            updateSkillsPreview();
            updateResume();
        }

        function addEducation() {
            const section = document.getElementById('educationSection');
            const newItem = document.createElement('div');
            newItem.className = 'dynamic-item';
            newItem.setAttribute('data-index', educationIndex);
            newItem.innerHTML = `
                <input type="text" placeholder="Degree/Qualification" class="education-degree">
                <input type="text" placeholder="Institution" class="education-institution">
                <input type="text" placeholder="Year" class="education-year">
                <button type="button" class="btn btn-secondary" onclick="removeEducation(${educationIndex})">Remove</button>
            `;
            section.appendChild(newItem);

            // Add event listeners to new inputs
            newItem.querySelectorAll('input').forEach(input => {
                input.addEventListener('input', function() {
                    updateResume();
                    updateProgressBar();
                });
            });

            educationIndex++;
        }

        function removeEducation(index) {
            const item = document.querySelector(`#educationSection [data-index="${index}"]`);
            if (item) {
                item.remove();
                updateResume();
                updateProgressBar();
            }
        }

        function addExperience() {
            const section = document.getElementById('experienceSection');
            const newItem = document.createElement('div');
            newItem.className = 'dynamic-item';
            newItem.setAttribute('data-index', experienceIndex);
            newItem.innerHTML = `
                <input type="text" placeholder="Job Title" class="experience-title">
                <input type="text" placeholder="Company" class="experience-company">
                <input type="text" placeholder="Duration" class="experience-duration">
                <textarea placeholder="Job Description" class="experience-description"></textarea>
                <button type="button" class="btn btn-secondary" onclick="removeExperience(${experienceIndex})">Remove</button>
            `;
            section.appendChild(newItem);

            // Add event listeners to new inputs
            newItem.querySelectorAll('input, textarea').forEach(input => {
                input.addEventListener('input', function() {
                    updateResume();
                    updateProgressBar();
                });
            });

            experienceIndex++;
        }

        function removeExperience(index) {
            const item = document.querySelector(`#experienceSection [data-index="${index}"]`);
            if (item) {
                item.remove();
                updateResume();
                updateProgressBar();
            }
        }

        function updateResume() {
            const name = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const summary = document.getElementById('profileSummary').value;

            const preview = document.getElementById('resumePreview');

            if (!name && !email && !phone) {
                preview.innerHTML = '<div class="empty-state">Fill out the form to see your resume preview here...</div>';
                return;
            }

            let resumeHTML = `
                <div class="resume-header">
                    <div class="resume-name">${name || 'Your Name'}</div>
                    <div class="resume-contact">
                        ${email ? `<span>📧 ${email}</span>` : ''}
                        ${phone ? `<span>📞 ${phone}</span>` : ''}
                    </div>
                </div>
            `;

            if (summary) {
                resumeHTML += `
                    <div class="resume-section">
                        <div class="resume-section-title">Profile Summary</div>
                        <div>${summary}</div>
                    </div>
                `;
            }

            if (skills.length > 0) {
                resumeHTML += `
                    <div class="resume-section">
                        <div class="resume-section-title">Skills</div>
                        <div class="resume-skills">
                            ${skills.map(skill => `<span class="resume-skill">${skill}</span>`).join('')}
                        </div>
                    </div>
                `;
            }

            // Education
            const educationItems = document.querySelectorAll('#educationSection .dynamic-item');
            let educationHTML = '';
            educationItems.forEach(item => {
                const degree = item.querySelector('.education-degree').value;
                const institution = item.querySelector('.education-institution').value;
                const year = item.querySelector('.education-year').value;
                
                if (degree || institution || year) {
                    educationHTML += `
                        <div class="resume-item">
                            <div class="resume-item-title">${degree}</div>
                            <div class="resume-item-subtitle">${institution} ${year ? `(${year})` : ''}</div>
                        </div>
                    `;
                }
            });

            if (educationHTML) {
                resumeHTML += `
                    <div class="resume-section">
                        <div class="resume-section-title">Education</div>
                        ${educationHTML}
                    </div>
                `;
            }

            // Experience
            const experienceItems = document.querySelectorAll('#experienceSection .dynamic-item');
            let experienceHTML = '';
            experienceItems.forEach(item => {
                const title = item.querySelector('.experience-title').value;
                const company = item.querySelector('.experience-company').value;
                const duration = item.querySelector('.experience-duration').value;
                const description = item.querySelector('.experience-description').value;
                
                if (title || company || duration || description) {
                    experienceHTML += `
                        <div class="resume-item">
                            <div class="resume-item-title">${title}</div>
                            <div class="resume-item-subtitle">${company} ${duration ? `(${duration})` : ''}</div>
                            ${description ? `<div>${description}</div>` : ''}
                        </div>
                    `;
                }
            });

            if (experienceHTML) {
                resumeHTML += `
                    <div class="resume-section">
                        <div class="resume-section-title">Experience</div>
                        ${experienceHTML}
                    </div>
                `;
            }

            preview.innerHTML = resumeHTML;
        }

        function clearForm() {
            if (confirm('Are you sure you want to clear all data?')) {
                document.getElementById('resumeForm').reset();
                skills = [];
                renderSkills();
                updateSkillsPreview();
                
                // Reset dynamic sections
                document.getElementById('educationSection').innerHTML = `
                    <div class="dynamic-item" data-index="0">
                        <input type="text" placeholder="Degree/Qualification" class="education-degree">
                        <input type="text" placeholder="Institution" class="education-institution">
                        <input type="text" placeholder="Year" class="education-year">
                        <button type="button" class="btn btn-secondary" onclick="removeEducation(0)">Remove</button>
                    </div>
                `;
                
                document.getElementById('experienceSection').innerHTML = `
                    <div class="dynamic-item" data-index="0">
                        <input type="text" placeholder="Job Title" class="experience-title">
                        <input type="text" placeholder="Company" class="experience-company">
                        <input type="text" placeholder="Duration" class="experience-duration">
                        <textarea placeholder="Job Description" class="experience-description"></textarea>
                        <button type="button" class="btn btn-secondary" onclick="removeExperience(0)">Remove</button>
                    </div>
                `;

                // Re-add event listeners
                const inputs = document.querySelectorAll('#resumeForm input, #resumeForm textarea');
                inputs.forEach(input => {
                    input.addEventListener('input', function() {
                        updateResume();
                        updateProgressBar();
                    });
                });

                educationIndex = 1;
                experienceIndex = 1;
                updateResume();
                updateProgressBar();
            }
        }

        function downloadPDF() {
            const name = document.getElementById('fullName').value || 'Resume';
            
            // Simple implementation - opens print dialog
            // In a real application, you'd use a library like jsPDF or html2pdf
            alert('PDF download feature would be implemented here using libraries like jsPDF or html2pdf. For now, you can use your browser\'s print function (Ctrl+P) to save as PDF.');
            
            // Alternative: Open print dialog
            window.print();
        }

        document.querySelector(".btn-success").addEventListener("click", () => {
    const resume = document.querySelector("#resumePreview")

    const options = {
        margin:       0.5,
        filename:     'My_Resume.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(options).from(resume).save();
});

