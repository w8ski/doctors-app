import { NextResponse } from "next/server";

import {
  deleteTreatment,
  getTreatmentById,
  updateTreatment,
} from "@/mock/data";
import { withSimulate } from "@/mock/simulate";

function parseId(value: string) {
  const id = Number(value);
  return Number.isFinite(id) ? id : null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const paramsData = await params;
  const id = parseId(paramsData.id);

  if (id === null) {
    return NextResponse.json(
      { message: "Invalid treatment id." },
      { status: 400 }
    );
  }

  const treatment = await getTreatmentById(id);

  if (!treatment) {
    return NextResponse.json(
      { message: "Treatment not found." },
      { status: 404 }
    );
  }

  return NextResponse.json(treatment);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const paramsData = await params;
  const id = parseId(paramsData.id);

  if (id === null) {
    return NextResponse.json(
      { message: "Invalid treatment id." },
      { status: 400 }
    );
  }

  return withSimulate(
    async () => {
      const payload = await request.json();

      if (!payload || typeof payload.status !== "string") {
        return NextResponse.json(
          { message: "Status is required." },
          { status: 422 }
        );
      }

      const updated = await updateTreatment(id, { status: payload.status });

      if (!updated) {
        return NextResponse.json(
          { message: "Treatment not found." },
          { status: 404 }
        );
      }

      return NextResponse.json(updated);
    },
    {
      allowFailure: true,
    }
  );
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const paramsData = await params;
  const id = parseId(paramsData.id);

  if (id === null) {
    return NextResponse.json(
      { message: "Invalid treatment id." },
      { status: 400 }
    );
  }

  return withSimulate(
    async () => {
      const deleted = await deleteTreatment(id);

      if (!deleted) {
        return NextResponse.json(
          { message: "Treatment not found." },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true }, { status: 200 });
    },
    {
      allowFailure: true,
    }
  );
}
