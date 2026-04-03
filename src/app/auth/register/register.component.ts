import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SpecialityAreaService } from '../../core/services/domain/speciality-area.service';
import { SpecialtyAreaResponseModel } from '../../core/models/specialty-area/specialty-area-response.model';
import { CreateTenantRequestModel } from '../../core/models/tenant/tenant-register-request.model';
import { TenantService } from '../../core/services/domain/tenant.service';
import { StepsModule } from 'primeng/steps';

// Country-State-City library
import { Country, State, City } from 'country-state-city';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,StepsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
   animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
                style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  specialityAreas: SpecialtyAreaResponseModel[] | null = [];

  // LOCATION DATA
  countries = Country.getAllCountries();
  states: any[] = [];
  cities: any[] = [];

  //Stepper 
  activeIndex = 0;

items: any[] = [
  { label: 'Organization Details' },
  { label: 'Address' },
  { label: 'Admin Info' },
  { label: 'Preview & Submit' }
];
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private specialtyAreaService: SpecialityAreaService,
    private tenantService: TenantService
  ) {}

  ngOnInit(): void {
    this.loadSpecialityAreas();
    this.initializeForm();
  }

  nextStep() {
  if (this.activeIndex === 0) {
    if (this.registerForm.get('name')?.valid &&
        this.registerForm.get('slug')?.valid &&
        this.registerForm.get('specialtyAreaId')?.valid) {
      this.activeIndex++;
    } else {
      this.registerForm.get('name')?.markAsTouched();
      this.registerForm.get('slug')?.markAsTouched();
      this.registerForm.get('specialtyAreaId')?.markAsTouched();
    }
  } else if (this.activeIndex === 1) {
    if (this.registerForm.get('physicalAddress')?.valid &&
        this.registerForm.get('country')?.valid &&
        this.registerForm.get('state')?.valid &&
        this.registerForm.get('city')?.valid) {
      this.activeIndex++;
    } else {
      this.registerForm.get('physicalAddress')?.markAsTouched();
      this.registerForm.get('country')?.markAsTouched();
      this.registerForm.get('state')?.markAsTouched();
      this.registerForm.get('city')?.markAsTouched();
    }
  } else if (this.activeIndex === 2) {
    if (this.registerForm.get('firstName')?.valid &&
        this.registerForm.get('lastName')?.valid &&
        this.registerForm.get('email')?.valid &&
        this.registerForm.get('password')?.valid &&
        this.registerForm.get('confirmPassword')?.valid) {
      this.activeIndex++;
    } else {
      this.registerForm.get('firstName')?.markAsTouched();
      this.registerForm.get('lastName')?.markAsTouched();
      this.registerForm.get('email')?.markAsTouched();
      this.registerForm.get('password')?.markAsTouched();
      this.registerForm.get('confirmPassword')?.markAsTouched();
    }
  }
}

prevStep() {
  if (this.activeIndex > 0) this.activeIndex--;
}


  // When country changes -> load states
  onCountryChange(): void {
    const selectedCountryCode = this.registerForm.get('country')?.value;
    this.states = State.getStatesOfCountry(selectedCountryCode);
    this.cities = [];

    // Reset state/city fields
    this.registerForm.patchValue({ state: '', city: '' });
  }

  // When state changes -> load cities
  onStateChange(): void {
    const countryCode = this.registerForm.get('country')?.value;
    const stateCode = this.registerForm.get('state')?.value;

    this.cities = City.getCitiesOfState(countryCode, stateCode);

    // Reset city
    this.registerForm.patchValue({ city: '' });
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group(
      {
        specialtyAreaId: ['', Validators.required],
        name: ['', Validators.required],
        slug: ['', Validators.required],
        physicalAddress: ['', Validators.required],

        // LOCATION FIELDS
        country: ['', Validators.required],
        state: ['', Validators.required],
        city: ['', Validators.required],

        firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
        lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
        email: ['', [Validators.required, Validators.email]],

        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],

        agreeToTerms: [false, Validators.requiredTrue]
      },
      { validators: passwordMatchValidator }
    );
  }

  private loadSpecialityAreas(): void {
    this.isLoading = true;
    this.specialtyAreaService.GetList().subscribe({
      next: (response) => {
        this.specialityAreas = response;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      console.log(this.registerForm.errors);
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formValue = this.registerForm.value;

    const tenantRequest: CreateTenantRequestModel = {
      specialtyAreaId: formValue.specialtyAreaId,
      name: formValue.name,
      slug: formValue.slug,
      physicalAddress: formValue.physicalAddress,
      city: formValue.city,
      state: formValue.state,
      country: formValue.country,
      admin: {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        password: formValue.password
      }
    };

    this.tenantService.CreateTenant(tenantRequest).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Registration successful!'
        });
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}

// PASSWORD MATCH VALIDATOR
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) return null;

  if (password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ mismatch: true });
    return { mismatch: true };
  }

  confirmPassword.setErrors(null);
  return null;
};
